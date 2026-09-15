import { useEffect, useMemo, useState } from "react";
import {
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
import { Marker, Circle, PROVIDER_DEFAULT } from "react-native-maps";
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

/** URL de la app de mapas del sistema (ADR-0005: sin turn-by-turn in-app). */
export function urlMapasSistema(lat: number, lon: number): string {
  if (Platform.OS === "ios") {
    return `http://maps.apple.com/?daddr=${lat},${lon}`;
  }
  if (Platform.OS === "android") {
    return `geo:${lat},${lon}?q=${lat},${lon}(${encodeURIComponent(NOMBRE_FUENTE)})`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

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

  const tengoSed = () => {
    const f = catalog.masCercana({ ...origen, ciudadId: "roma" });
    if (!f) {
      setMensajeSed("Sin fuente usable cerca (ocultas/secas excluidas).");
      return;
    }
    seleccionar(f);
    setMensajeSed(`${NOMBRE_FUENTE} usable a ${Math.round(f.distanciaM)} m`);
  };

  const abrirEnMapas = () => {
    if (!seleccion) return;
    void Linking.openURL(urlMapasSistema(seleccion.lat, seleccion.lon));
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
        <Button title="Tengo sed" onPress={tengoSed} color="#0b6e4f" />
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
          {fuentes.map((f) => (
            <Marker
              key={f.id}
              identifier={f.id}
              coordinate={{ latitude: f.lat, longitude: f.lon }}
              title={NOMBRE_FUENTE}
              description={`${Math.round(f.distanciaM)} m`}
              pinColor="#c45c26"
              tracksViewChanges={false}
              onPress={(e) => {
                e.stopPropagation();
                seleccionar(f);
              }}
            />
          ))}
          {seleccion ? (
            <Circle
              center={{ latitude: seleccion.lat, longitude: seleccion.lon }}
              radius={35}
              strokeColor="#0b6e4f"
              fillColor="rgba(11, 110, 79, 0.28)"
              strokeWidth={2}
              zIndex={1}
            />
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

      <View style={estilos.ficha}>
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
      </View>
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
