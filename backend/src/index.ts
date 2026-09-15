import { createServer } from "node:http";
import {
  FakePhotoReview,
  HaversinePresenceGate,
  InMemoryFuenteCatalog,
  PotableFountainImporter,
  ROMA_OSM_CANDIDATAS,
} from "@erasmusu/domain";

const PORT = Number(process.env["PORT"] ?? 3000);

/** Datastore: en memoria; seeds OSM Roma potable-only (T2). */
const catalog = new InMemoryFuenteCatalog({
  presence: new HaversinePresenceGate(),
  photos: new FakePhotoReview(),
  importer: new PotableFountainImporter(),
});

const creadas = catalog.importar(ROMA_OSM_CANDIDATAS);
console.log(
  `[backend] import OSM Roma: ${creadas} potables (Trevi ornamental excluida)`,
);

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("access-control-allow-origin", "*");

  if (url.pathname === "/health") {
    res.end(
      JSON.stringify({
        ok: true,
        servicio: "erasmusu-backend-t2",
        fuentesRoma: catalog.cercanas({
          lat: 41.9028,
          lon: 12.4964,
          ciudadId: "roma",
          limite: 500,
        }).length,
      }),
    );
    return;
  }

  if (url.pathname === "/fuentes/cercanas") {
    const lat = Number(url.searchParams.get("lat") ?? "41.9028");
    const lon = Number(url.searchParams.get("lon") ?? "12.4964");
    const ciudadId = url.searchParams.get("ciudadId") ?? "roma";
    const limite = Number(url.searchParams.get("limite") ?? "200");
    // Descubrimiento sin cuenta (historia 29 / AC T2).
    res.end(JSON.stringify(catalog.cercanas({ lat, lon, ciudadId, limite })));
    return;
  }

  if (
    url.pathname.startsWith("/fuentes/") &&
    url.pathname !== "/fuentes/cercanas"
  ) {
    const id = decodeURIComponent(url.pathname.slice("/fuentes/".length));
    const lat = Number(url.searchParams.get("lat") ?? "41.9028");
    const lon = Number(url.searchParams.get("lon") ?? "12.4964");
    const f = catalog.detalle(id, { lat, lon });
    if (!f) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "no-encontrado" }));
      return;
    }
    res.end(JSON.stringify(f));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "no-encontrado" }));
});

server.listen(PORT, () => {
  console.log(
    `[backend] http://localhost:${PORT} (/health, /fuentes/cercanas, /fuentes/:id)`,
  );
});
