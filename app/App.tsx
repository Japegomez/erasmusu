import { useMemo, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { InMemoryFuenteCatalog } from "@erasmusu/domain";
import {
  FakeFountainImporter,
  FakePhotoReview,
  HaversinePresenceGate,
} from "@erasmusu/domain";

/**
 * Shell T1: un solo codebase iOS + Android (ADR-0002). El gesto "tengo sed"
 * llama a la seam FuenteCatalog (spec historia 36); GPS real, mapa y ficha
 * llegan en T3a. Sin anuncios ni paywall (ADR-0010).
 */
export default function App() {
  const catalog = useMemo(
    () =>
      new InMemoryFuenteCatalog({
        presence: new HaversinePresenceGate(),
        photos: new FakePhotoReview(),
        importer: new FakeFountainImporter(),
      }),
    [],
  );
  const [texto, setTexto] = useState("Pulsa «tengo sed» (demo local T1).");

  const tengoSed = () => {
    // Roma centro; el GPS real se cablea en T3a con PresenceGate real.
    const f = catalog.masCercana({ lat: 41.9028, lon: 12.4964 });
    setTexto(
      f
        ? `Fuente más cercana: ${f.id} a ${Math.round(f.distanciaM)} m`
        : "Sin fuentes en caché local (el import OSM llega en T2).",
    );
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Erasmusu · Roma (T1)</Text>
      <Text style={estilos.sub}>Gratis, sin anuncios ni paywall.</Text>
      <Button title="Tengo sed" onPress={tengoSed} />
      <Text style={estilos.resultado}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  sub: { fontSize: 13, marginBottom: 16 },
  resultado: { fontSize: 15, marginTop: 16, textAlign: "center" },
});
