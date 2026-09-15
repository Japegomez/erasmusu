import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Animated,
  Button,
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from "react-native-maps";
import ClusteredMapView from "react-native-map-clustering";
import * as Location from "expo-location";
import {
  HaversinePresenceGate,
  InMemoryFuenteCatalog,
  PotableFountainImporter,
  FakePhotoReview,
  ROMA_OSM_CANDIDATAS,
  type FuentePublica,
} from "@erasmusu/domain";

/** Centro de Roma: fallback si no hay permiso de ubicación. */
const ROMA = { lat: 41.9028, lon: 12.4964 };
const NOMBRE_FUENTE = "Fuente";
/**
 * Delta máximo tras «Tengo sed». 0.01 seguía dejando clusters en Roma densa;
 * ~0.0015 ≈ calle, suele sacar el pin del cluster.
 */
const DELTA_FOCO_SED_MAX = 0.0015;
/** Margen extra de zoom: la fórmula delta↔zoom subestima frente a GeoViewport. */
const MARGEN_ZOOM_DESCLUSTER = 2;

type SuperClusterLike = {
  getClusters: (
    bbox: [number, number, number, number],
    zoom: number,
  ) => Array<{
    id?: number | string;
    properties: { cluster?: boolean; cluster_id?: number; identifier?: string };
    geometry: { coordinates: [number, number] };
  }>;
  getLeaves: (
    clusterId: number | string,
    limit?: number,
  ) => Array<{
    properties: { identifier?: string };
    geometry: { coordinates: [number, number] };
  }>;
  getClusterExpansionZoom: (clusterId: number | string) => number;
};

/** True si la hoja de SuperCluster corresponde a la fuente (id o coords). */
function hojaEsFuente(
  leaf: {
    properties: { identifier?: string };
    geometry: { coordinates: [number, number] };
  },
  fuenteId: string,
  lat: number,
  lon: number,
): boolean {
  if (leaf.properties.identifier === fuenteId) return true;
  const [lng, la] = leaf.geometry.coordinates;
  return Math.abs(la - lat) < 1e-6 && Math.abs(lng - lon) < 1e-6;
}

/** Cluster de SuperCluster cuyas hojas incluyen la fuente dada. */
function clusterQueContieneFuente(
  sc: SuperClusterLike,
  fuenteId: string,
  lat: number,
  lon: number,
  zoom: number,
) {
  const features = sc.getClusters([-180, -85, 180, 85], zoom);
  for (const f of features) {
    if (!f.properties.cluster) continue;
    const clusterId = f.properties.cluster_id ?? f.id;
    if (clusterId == null) continue;
    const leaves = sc.getLeaves(clusterId, Infinity);
    if (leaves.some((leaf) => hojaEsFuente(leaf, fuenteId, lat, lon))) {
      return { ...f, id: clusterId };
    }
  }
  return null;
}

/**
 * Zoom en el que la fuente deja de estar en un cluster, más margen
 * para compensar la conversión a latitudeDelta.
 */
function zoomSinCluster(
  sc: SuperClusterLike,
  fuenteId: string,
  lat: number,
  lon: number,
  zoomPartida = 0,
): number {
  let zoom = Math.max(0, Math.floor(zoomPartida));
  let vioCluster = false;
  for (let i = 0; i < 16; i++) {
    const cluster = clusterQueContieneFuente(sc, fuenteId, lat, lon, zoom);
    if (!cluster) {
      // Si nunca vimos cluster (matching falló), forzar zoom de calle.
      if (!vioCluster) return 18;
      return zoom + MARGEN_ZOOM_DESCLUSTER;
    }
    vioCluster = true;
    const siguiente = sc.getClusterExpansionZoom(cluster.id);
    if (siguiente <= zoom) return zoom + 1 + MARGEN_ZOOM_DESCLUSTER;
    zoom = siguiente;
  }
  return zoom + MARGEN_ZOOM_DESCLUSTER;
}

/** Convierte nivel de zoom de mapa a latitudeDelta aproximado. */
function deltaDesdeZoom(zoom: number): number {
  return 360 / Math.pow(2, Math.max(zoom, 1));
}

/** Región centrada en la fuente con zoom suficiente para salir del cluster. */
function regionFocoFuente(
  sc: SuperClusterLike | null,
  fuente: { id: string; lat: number; lon: number },
) {
  const zoom = sc
    ? zoomSinCluster(sc, fuente.id, fuente.lat, fuente.lon)
    : 18;
  const delta = Math.min(deltaDesdeZoom(zoom), DELTA_FOCO_SED_MAX);
  return {
    latitude: fuente.lat,
    longitude: fuente.lon,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

/** Destinos externos (ADR-0005: sin turn-by-turn in-app). */
type OpcionMapa = {
  titulo: string;
  /** URL preferida (app nativa si existe). */
  url: string;
  /** Si falla la app, abrir esta (https). */
  fallback?: string;
};

/** Lista de apps/URLs candidatas para llegar a la fuente (según plataforma). */
export function opcionesAbrirEnMapas(lat: number, lon: number): OpcionMapa[] {
  const dest = `${lat},${lon}`;
  const label = encodeURIComponent(NOMBRE_FUENTE);
  const web = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
  const opciones: OpcionMapa[] = [];

  if (Platform.OS === "ios") {
    opciones.push({
      titulo: "Apple Maps",
      url: `http://maps.apple.com/?daddr=${dest}&dirflg=w`,
    });
  }

  opciones.push({
    titulo: "Google Maps",
    url:
      Platform.OS === "ios"
        ? `comgooglemaps://?daddr=${dest}&directionsmode=walking`
        : `google.navigation:q=${dest}`,
    fallback: web,
  });

  opciones.push({
    titulo: "Waze",
    url: `waze://?ll=${dest}&navigate=yes`,
    fallback: `https://waze.com/ul?ll=${dest}&navigate=yes`,
  });

  if (Platform.OS === "android") {
    opciones.push({
      titulo: "Otras apps de mapas",
      url: `geo:${lat},${lon}?q=${lat},${lon}(${label})`,
      fallback: web,
    });
  }

  opciones.push({
    titulo: "Abrir en el navegador",
    url: web,
  });

  return opciones;
}

/** Abre la URL nativa de la opción o su fallback https si no está instalada. */
async function abrirUrlMapa(opcion: OpcionMapa): Promise<void> {
  try {
    const puede = await Linking.canOpenURL(opcion.url);
    if (puede) {
      await Linking.openURL(opcion.url);
      return;
    }
  } catch {
    // Schemes no declarados pueden lanzar; caemos al fallback.
  }
  if (opcion.fallback) {
    await Linking.openURL(opcion.fallback);
    return;
  }
  await Linking.openURL(opcion.url);
}

/** Muestra Apple Maps / Google Maps / Waze / otras (según plataforma). */
export async function mostrarSelectorMapas(
  lat: number,
  lon: number,
): Promise<void> {
  const opciones = opcionesAbrirEnMapas(lat, lon);

  if (Platform.OS === "ios") {
    return new Promise((resolve) => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Abrir en mapas",
          message: "Elige una app para llegar a la fuente",
          options: [...opciones.map((o) => o.titulo), "Cancelar"],
          cancelButtonIndex: opciones.length,
        },
        (indice) => {
          if (indice === opciones.length || indice == null) {
            resolve();
            return;
          }
          const elegida = opciones[indice];
          if (!elegida) {
            resolve();
            return;
          }
          void abrirUrlMapa(elegida).finally(resolve);
        },
      );
    });
  }

  return new Promise((resolve) => {
    // Android Alert solo respeta 3 botones; cancelación = dismiss del diálogo.
    const opcionesAndroid = opciones.filter(
      (opcion) => opcion.titulo !== "Abrir en el navegador",
    );
    Alert.alert(
      "Abrir en mapas",
      "Elige una app para llegar a la fuente",
      opcionesAndroid.map((opcion) => ({
        text: opcion.titulo,
        onPress: () => {
          void abrirUrlMapa(opcion).finally(resolve);
        },
      })),
      { cancelable: true, onDismiss: () => resolve() },
    );
  });
}

/** Etiqueta legible del estado operativo de una fuente. */
function textoEstado(estado: FuentePublica["estado"]): string {
  switch (estado) {
    case "en-servicio":
      return "en servicio";
    case "seca":
      return "seca / sin caudal";
    case "incidencia-temporal":
      return "incidencia temporal";
    default:
      return "estado desconocido";
  }
}

/** Texto de frescura («confirmada hace X días») o null si no hay fecha. */
function textoFrescura(dias: number | null): string | null {
  if (dias === null) return null;
  if (dias === 0) return "confirmada hoy";
  if (dias === 1) return "confirmada hace 1 día";
  return `confirmada hace ${dias} días`;
}

/**
 * T3a: modo sed en línea — GPS → masCercana usable → ficha (estado,
 * frescura, reciente) → abrir en mapas del sistema. Sin cuenta ni ads.
 */
export default function App() {
  const { height } = useWindowDimensions();
  const catalog = useMemo(() => {
    const cat = new InMemoryFuenteCatalog({
      presence: new HaversinePresenceGate(),
      photos: new FakePhotoReview(),
      importer: new PotableFountainImporter(),
    });
    cat.importar(ROMA_OSM_CANDIDATAS);
    return cat;
  }, []);

  const [origen, setOrigen] = useState(ROMA);
  const [gpsEstado, setGpsEstado] = useState<"pendiente" | "ok" | "fallback">(
    "pendiente",
  );
  const [seleccionId, setSeleccionId] = useState<string | undefined>();
  const [vista, setVista] = useState<"mapa" | "lista">("mapa");
  const [mensajeSed, setMensajeSed] = useState<string | null>(null);
  /** Dispara recentrado del mapa hacia la fuente del gesto sed. */
  const [focoSed, setFocoSed] = useState<{
    id: string;
    lat: number;
    lon: number;
    nonce: number;
  } | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const superClusterRef = useRef<SuperClusterLike | null>(null);
  const fichaAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (!cancelado) setGpsEstado("fallback");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelado) return;
        setOrigen({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setGpsEstado("ok");
      } catch {
        if (!cancelado) setGpsEstado("fallback");
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  const fuentes = useMemo(
    () => catalog.cercanas({ ...origen, ciudadId: "roma", limite: 500 }),
    [catalog, origen],
  );

  const seleccion = useMemo(
    () =>
      seleccionId
        ? catalog.detalle(seleccionId, origen)
        : undefined,
    [catalog, seleccionId, origen],
  );

  const seleccionar = (f: FuentePublica) => {
    setSeleccionId(f.id);
  };

  useEffect(() => {
    if (!seleccionId) return;
    fichaAnim.setValue(0);
    Animated.timing(fichaAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [seleccionId, fichaAnim]);

  useEffect(() => {
    if (vista !== "mapa" || !focoSed) return;
    let cancelado = false;
    let intento = 0;

    const enfocar = () => {
      if (cancelado) return;
      const sc = superClusterRef.current;
      if (!sc && intento < 12) {
        intento += 1;
        setTimeout(enfocar, 40);
        return;
      }
      mapRef.current?.animateToRegion(regionFocoFuente(sc, focoSed), 550);
      // Suelta el foco tras la animación para no pelear con el zoom manual.
      setTimeout(() => {
        if (!cancelado) setFocoSed(null);
      }, 600);
    };

    const t = setTimeout(enfocar, 50);
    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }, [vista, focoSed]);

  const tengoSed = () => {
    if (gpsEstado === "pendiente") {
      setMensajeSed("Esperando ubicación…");
      return;
    }
    const f = catalog.masCercana({ ...origen, ciudadId: "roma" });
    if (!f) {
      setMensajeSed("Sin fuente usable cerca (ocultas/secas excluidas).");
      return;
    }
    seleccionar(f);
    setVista("mapa");
    setFocoSed({ id: f.id, lat: f.lat, lon: f.lon, nonce: Date.now() });
    setMensajeSed(`${NOMBRE_FUENTE} usable a ${Math.round(f.distanciaM)} m`);
  };

  const abrirEnMapas = () => {
    if (!seleccion) return;
    void mostrarSelectorMapas(seleccion.lat, seleccion.lon);
  };

  const origenLabel =
    gpsEstado === "ok"
      ? "desde tu ubicación"
      : gpsEstado === "fallback"
        ? "desde centro de Roma (sin GPS)"
        : "ubicando…";

  return (
    <View style={estilos.raiz}>
      <View style={estilos.cabecera}>
        <Text style={estilos.titulo}>Erasmusu · Roma</Text>
        <Text style={estilos.sub}>
          {fuentes.length} fuentes potables · sin cuenta · {origenLabel}
        </Text>
        <Button
          title="Tengo sed"
          onPress={tengoSed}
          color="#0b6e4f"
          disabled={gpsEstado === "pendiente"}
        />
        {mensajeSed ? <Text style={estilos.sed}>{mensajeSed}</Text> : null}
        <View style={estilos.tabs}>
          <Pressable
            onPress={() => setVista("mapa")}
            style={[estilos.tab, vista === "mapa" && estilos.tabActiva]}
          >
            <Text style={estilos.tabTexto}>Mapa</Text>
          </Pressable>
          <Pressable
            onPress={() => setVista("lista")}
            style={[estilos.tab, vista === "lista" && estilos.tabActiva]}
          >
            <Text style={estilos.tabTexto}>Lista</Text>
          </Pressable>
        </View>
      </View>

      {vista === "mapa" ? (
        <ClusteredMapView
          key={`mapa-${origen.lat.toFixed(4)}-${origen.lon.toFixed(4)}`}
          ref={mapRef}
          superClusterRef={superClusterRef}
          style={{ height: height * 0.48, width: "100%" }}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: origen.lat,
            longitude: origen.lon,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          clusterColor="#0b6e4f"
          clusterTextColor="#ffffff"
          radius={48}
          extent={512}
          minPoints={3}
          animationEnabled={false}
          spiralEnabled={false}
          showsUserLocation={gpsEstado === "ok"}
        >
          {fuentes
            .filter((f) => f.id !== seleccionId)
            .map((f) => (
              <Marker
                key={f.id}
                identifier={f.id}
                coordinate={{ latitude: f.lat, longitude: f.lon }}
                pinColor="#c45c26"
                tracksViewChanges={false}
                onPress={(e) => {
                  e.stopPropagation();
                  seleccionar(f);
                }}
              />
            ))}
          {seleccion ? (
            <>
              {/* Fuera de clustering: sigue visible al hacer zoom out. */}
              <Marker
                key={`sel-${seleccion.id}`}
                identifier={seleccion.id}
                coordinate={{
                  latitude: seleccion.lat,
                  longitude: seleccion.lon,
                }}
                pinColor="#0b6e4f"
                // Convención de react-native-map-clustering: no entra en SuperCluster.
                {...({ cluster: false } as { cluster: boolean })}
                zIndex={10}
                tracksViewChanges={false}
                onPress={(e) => {
                  e.stopPropagation();
                  seleccionar(seleccion);
                }}
              />
              <Circle
                center={{ latitude: seleccion.lat, longitude: seleccion.lon }}
                radius={45}
                strokeColor="#0b6e4f"
                fillColor="rgba(11, 110, 79, 0.32)"
                strokeWidth={3}
                zIndex={9}
              />
            </>
          ) : null}
        </ClusteredMapView>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={fuentes}
          keyExtractor={(f) => f.id}
          contentContainerStyle={estilos.listaPad}
          renderItem={({ item }) => (
            <Pressable
              style={[
                estilos.fila,
                seleccionId === item.id && estilos.filaActiva,
              ]}
              onPress={() => seleccionar(item)}
            >
              <Text style={estilos.filaTitulo}>{NOMBRE_FUENTE}</Text>
              <Text style={estilos.filaMeta}>
                {Math.round(item.distanciaM)} m · {textoEstado(item.estado)}
              </Text>
            </Pressable>
          )}
        />
      )}

      <Animated.View
        style={[
          estilos.ficha,
          {
            opacity: fichaAnim,
            transform: [
              {
                translateY: fichaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 0],
                }),
              },
            ],
          },
        ]}
      >
        {seleccion ? (
          <>
            <Text style={estilos.fichaTitulo}>{NOMBRE_FUENTE}</Text>
            <Text style={estilos.fichaCuerpo}>
              {Math.round(seleccion.distanciaM)} m · {textoEstado(seleccion.estado)}
              {" · "}
              {textoFrescura(seleccion.confirmadaHaceDias) ??
                "sin confirmación reciente"}
            </Text>
            {seleccion.reciente ? (
              <Text style={estilos.avisoReciente}>
                Aviso de reciente: aún sin respaldo de la comunidad; se muestra
                con menos confianza.
              </Text>
            ) : null}
            <View style={estilos.fichaAcciones}>
              <Button
                title="Abrir en mapas"
                onPress={abrirEnMapas}
                color="#0b6e4f"
              />
            </View>
          </>
        ) : (
          <Text style={estilos.fichaCuerpo}>
            Pulsa «Tengo sed» o elige un pin.
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: "#f7f3eb" },
  cabecera: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#1c2b2d",
  },
  titulo: { fontSize: 22, fontWeight: "700", color: "#f7f3eb" },
  sub: { fontSize: 12, color: "#c5d0d1", marginTop: 4, marginBottom: 8 },
  sed: { fontSize: 12, color: "#a8e6cf", marginTop: 6, marginBottom: 4 },
  tabs: { flexDirection: "row", gap: 8, marginTop: 8 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: "#2e4447",
  },
  tabActiva: { backgroundColor: "#0b6e4f" },
  tabTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  listaPad: { padding: 12, paddingBottom: 24 },
  fila: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9d2c5",
  },
  filaActiva: { backgroundColor: "#e5efe9" },
  filaTitulo: { fontSize: 14, fontWeight: "600", color: "#1c2b2d" },
  filaMeta: { fontSize: 12, color: "#5a6466", marginTop: 2 },
  ficha: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#d9d2c5",
    backgroundColor: "#fffef9",
  },
  fichaTitulo: { fontSize: 12, fontWeight: "700", color: "#0b6e4f" },
  fichaCuerpo: { fontSize: 14, color: "#1c2b2d", marginTop: 4, lineHeight: 20 },
  avisoReciente: {
    fontSize: 12,
    color: "#8a5a2b",
    marginTop: 8,
    lineHeight: 18,
  },
  fichaAcciones: { marginTop: 12 },
});
