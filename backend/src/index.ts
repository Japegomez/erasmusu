import { createServer } from "node:http";
import { InMemoryFuenteCatalog } from "@erasmusu/domain";
import {
  FakeFountainImporter,
  FakePhotoReview,
  HaversinePresenceGate,
} from "@erasmusu/domain";

const PORT = Number(process.env["PORT"] ?? 3000);

/** Datastore T1: en memoria (Postgres planificado sin cambiar FuenteCatalog). */
const catalog = new InMemoryFuenteCatalog({
  presence: new HaversinePresenceGate(),
  photos: new FakePhotoReview(),
  importer: new FakeFountainImporter(),
});

// Semilla Roma (2 nasoni de ejemplo; el import OSM real llega en T2).
catalog.importar([
  {
    idExterno: "seed-pantheon",
    lat: 41.8986,
    lon: 12.4769,
    ciudadId: "roma",
    tags: { amenity: "drinking_water" },
  },
  {
    idExterno: "seed-trastevere",
    lat: 41.8897,
    lon: 12.4692,
    ciudadId: "roma",
    tags: { amenity: "drinking_water" },
  },
]);

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  res.setHeader("content-type", "application/json; charset=utf-8");
  if (url.pathname === "/health") {
    res.end(JSON.stringify({ ok: true, servicio: "erasmusu-backend-t1" }));
    return;
  }
  if (url.pathname === "/fuentes/cercanas") {
    const lat = Number(url.searchParams.get("lat") ?? "41.9028");
    const lon = Number(url.searchParams.get("lon") ?? "12.4964");
    const ciudadId = url.searchParams.get("ciudadId") ?? "roma";
    res.end(JSON.stringify(catalog.cercanas({ lat, lon, ciudadId })));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "no-encontrado" }));
});

server.listen(PORT, () => {
  console.log(`[backend] http://localhost:${PORT} (/health, /fuentes/cercanas)`);
});
