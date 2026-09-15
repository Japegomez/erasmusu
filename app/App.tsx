import { useMemo, useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Marker, Circle, PROVIDER_DEFAULT } from "react-native-maps";
import ClusteredMapView from "react-native-map-clustering";
import {
  HaversinePresenceGate,
  InMemoryFuenteCatalog,
  PotableFountainImporter,
  FakePhotoReview,
  ROMA_OSM_CANDIDATAS,
  type FuentePublica,
} from "@erasmusu/domain";

const ROMA = { lat: 41.9028, lon: 12.4964 };
const NOMBRE_FUENTE = "Fuente";

/**
 * T2: mapa + lista de fuentes potables OSM Roma, sin cuenta.
 * Snapshot ODbL potable-only (Trevi ornamental filtrado al importar).
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

  const fuentes = useMemo(
    () => catalog.cercanas({ ...ROMA, ciudadId: "roma", limite: 500 }),
    [catalog],
  );

  /** Solo el id: cambia el pinColor remonta Markers y “salta” la selección. */
  const [seleccionId, setSeleccionId] = useState<string | undefined>(
    () => fuentes[0]?.id,
  );
  const [vista, setVista] = useState<"mapa" | "lista">("mapa");
  const [sed, setSed] = useState<string | null>(null);

  const seleccion = useMemo(
    () => fuentes.find((f) => f.id === seleccionId),
    [fuentes, seleccionId],
  );

  const seleccionar = (f: FuentePublica) => {
    setSeleccionId(f.id);
  };

  const tengoSed = () => {
    const f = catalog.masCercana({ ...ROMA, ciudadId: "roma" });
    if (!f) {
      setSed("Sin fuentes potables en el catálogo.");
      return;
    }
    seleccionar(f);
    setSed(
      `${NOMBRE_FUENTE} más cercana a ${Math.round(f.distanciaM)} m`,
    );
  };

  return (
    <View style={estilos.raiz}>
      <View style={estilos.cabecera}>
        <Text style={estilos.titulo}>Erasmusu · Roma</Text>
        <Text style={estilos.sub}>
          {fuentes.length} fuentes potables · sin cuenta · ODbL OSM
        </Text>
        <Button title="Tengo sed" onPress={tengoSed} color="#0b6e4f" />
        {sed ? <Text style={estilos.sed}>{sed}</Text> : null}
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
          style={{ height: height * 0.48, width: "100%" }}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: ROMA.lat,
            longitude: ROMA.lon,
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
                {Math.round(item.distanciaM)} m · {item.lat.toFixed(5)},{" "}
                {item.lon.toFixed(5)}
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
              {Math.round(seleccion.distanciaM)} m desde el centro · estado{" "}
              {seleccion.estado}
            </Text>
          </>
        ) : (
          <Text style={estilos.fichaCuerpo}>Elige un pin o una fila.</Text>
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
});
