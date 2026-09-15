import { describe, expect, it } from "vitest";
import { InMemoryFuenteCatalog } from "../src/catalog.js";
import {
  PotableFountainImporter,
  FakePhotoReview,
  HaversinePresenceGate,
  esPotableOsm,
  parseMadridMunicipal,
  parseOsmElements,
} from "../src/adapters.js";
import { MADRID_EN_SERVICIO_FIXTURE } from "../src/fixtures/madridEnServicio.js";
import { ROMA_OSM_CANDIDATAS } from "../src/fixtures/romaOsmRaw.js";

function deps(importer = new PotableFountainImporter()) {
  return {
    presence: new HaversinePresenceGate(),
    photos: new FakePhotoReview(),
    importer,
    ahora: () => new Date("2026-09-15T10:00:00.000Z"),
  };
}

const ROMA = { lat: 41.9028, lon: 12.4964 };

describe("T2 FountainImporter multi-fuente + import idempotente", () => {
  it("potable-only: Trevi ornamental ausente; drinking_water=yes entra", () => {
    const importer = new PotableFountainImporter();
    const potables = importer.filtrarPotables([
      {
        idExterno: "osm-nasone",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water", fountain: "nasone" },
      },
      {
        idExterno: "osm-trevi",
        lat: 41.9009,
        lon: 12.4833,
        ciudadId: "roma",
        tags: { amenity: "fountain", name: "Fontana di Trevi", drinking_water: "no" },
      },
      {
        idExterno: "osm-spring",
        lat: ROMA.lat + 0.001,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { natural: "spring", drinking_water: "yes" },
      },
    ]);
    expect(potables.map((p) => p.idExterno).sort()).toEqual([
      "osm-nasone",
      "osm-spring",
    ]);
    expect(esPotableOsm({ amenity: "fountain" })).toBe(false);
  });

  it("segunda fuente municipal Madrid: OPERATIVO/EN SERVICIO mapean; fuera de servicio se conserva como estado", () => {
    const importer = new PotableFountainImporter();
    const candidatas = importer.desdeMadridMunicipal([
      ...MADRID_EN_SERVICIO_FIXTURE,
    ]);
    expect(candidatas).toHaveLength(3);
    expect(candidatas.every((c) => c.ciudadId === "madrid")).toBe(true);
    expect(candidatas.map((c) => c.estadoMunicipal)).toEqual([
      "en-servicio",
      "en-servicio",
      "fuera-de-servicio",
    ]);
    // También vía parseador puro (misma forma)
    expect(parseMadridMunicipal([...MADRID_EN_SERVICIO_FIXTURE])).toHaveLength(3);
  });

  it("re-import actualiza coordenadas/estado en vez de duplicar", () => {
    const cat = new InMemoryFuenteCatalog(deps());
    const n1 = cat.importar([
      {
        idExterno: "osm-1",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
    expect(n1).toBe(1);
    const n2 = cat.importar([
      {
        idExterno: "osm-1",
        lat: ROMA.lat + 0.01,
        lon: ROMA.lon + 0.01,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
        estadoMunicipal: "en-servicio",
      },
    ]);
    expect(n2).toBe(0);
    const lista = cat.cercanas({ ...ROMA, ciudadId: "roma", limite: 10 });
    expect(lista).toHaveLength(1);
    expect(lista[0]!.lat).toBeCloseTo(ROMA.lat + 0.01, 5);
    expect(lista[0]!.lon).toBeCloseTo(ROMA.lon + 0.01, 5);
    expect(lista[0]!.estado).toBe("en-servicio");
  });

  it("snapshot OSM Roma: pines potables reales; Trevi sentinel no entra", () => {
    const importer = new PotableFountainImporter();
    const potables = importer.filtrarPotables(ROMA_OSM_CANDIDATAS);
    expect(potables.length).toBeGreaterThan(100);
    expect(potables.some((p) => /trevi/i.test(p.tags["name"] ?? ""))).toBe(false);
    expect(
      potables.every(
        (p) =>
          p.tags["amenity"] === "drinking_water" || p.tags["drinking_water"] === "yes",
      ),
    ).toBe(true);

    const cat = new InMemoryFuenteCatalog(deps(importer));
    const creadas = cat.importar(ROMA_OSM_CANDIDATAS);
    expect(creadas).toBe(potables.length);
    expect(cat.importar(ROMA_OSM_CANDIDATAS)).toBe(0);
    const cercanas = cat.cercanas({ ...ROMA, ciudadId: "roma", limite: 50 });
    expect(cercanas.length).toBeGreaterThan(0);
    expect(cercanas.every((f) => f.ciudadId === "roma")).toBe(true);
  });

  it("parseOsmElements convierte nodos Overpass a FuenteBruta", () => {
    const brutas = parseOsmElements(
      {
        elements: [
          {
            type: "node",
            id: 1,
            lat: 41.9,
            lon: 12.5,
            tags: { amenity: "drinking_water" },
          },
          { type: "way", id: 2, tags: { amenity: "drinking_water" } },
        ],
      },
      "roma",
    );
    expect(brutas).toEqual([
      {
        idExterno: "osm-node-1",
        lat: 41.9,
        lon: 12.5,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
  });
});
