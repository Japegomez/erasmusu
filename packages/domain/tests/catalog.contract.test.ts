import { describe, expect, it } from "vitest";
import { InMemoryFuenteCatalog } from "../src/catalog.js";
import {
  FakeFountainImporter,
  FakePhotoReview,
  HaversinePresenceGate,
} from "../src/adapters.js";

function deps() {
  return {
    presence: new HaversinePresenceGate(),
    photos: new FakePhotoReview(),
    importer: new FakeFountainImporter(),
    ahora: () => new Date("2026-09-14T10:00:00.000Z"),
  };
}

/** Roma centro aprox. */
const ROMA = { lat: 41.9028, lon: 12.4964 };

describe("FuenteCatalog (contrato T1, solo fakes)", () => {
  it("import solo-potable: excluye ornamental Trevi e idempotente al re-importar", () => {
    const cat = new InMemoryFuenteCatalog(deps());
    const n = cat.importar([
      {
        idExterno: "osm-nasone-1",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
      {
        idExterno: "osm-trevi",
        lat: 41.9009,
        lon: 12.4833,
        ciudadId: "roma",
        tags: { amenity: "fountain", tourism: "attraction" },
      },
    ]);
    expect(n).toBe(1);
    expect(cat.cercanas({ ...ROMA, ciudadId: "roma" })).toHaveLength(1);
    // Re-import actualiza en vez de duplicar
    const n2 = cat.importar([
      {
        idExterno: "osm-nasone-1",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
    expect(n2).toBe(0);
    expect(cat.cercanas({ ...ROMA, ciudadId: "roma" })).toHaveLength(1);
  });

  it("descubrimiento sin cuenta: nearest ignora ocultas y ordena por distancia", () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar([
      {
        idExterno: "a",
        lat: ROMA.lat + 0.002,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
      {
        idExterno: "b",
        lat: ROMA.lat + 0.001,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
      {
        idExterno: "oculta-cerca",
        lat: ROMA.lat + 0.0005,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
    const oculta = cat.cercanas({ ...ROMA, ciudadId: "roma" }).find(
      (f) => f.idExterno === "oculta-cerca",
    )!;
    cat.forzarOculta(oculta.id, true);

    const todas = cat.cercanas({ ...ROMA, ciudadId: "roma" });
    expect(todas.map((f) => f.idExterno)).toEqual(["b", "a"]);
    expect(todas.some((f) => f.oculta)).toBe(false);
    const mas = cat.masCercana({ ...ROMA });
    expect(mas?.idExterno).toBe("b");
    // Ocultación blanda: detalle aún deja rastro
    expect(cat.detalle(oculta.id)?.oculta).toBe(true);
  });

  it("modo sed: masCercana ignora secas", async () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar([
      {
        idExterno: "seca-cerca",
        lat: ROMA.lat + 0.0005,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
      {
        idExterno: "usable",
        lat: ROMA.lat + 0.002,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
        estadoMunicipal: "en-servicio",
      },
    ]);
    const seca = cat.cercanas({ ...ROMA }).find((f) => f.idExterno === "seca-cerca")!;
    await cat.senalar({
      personaId: "p1",
      conCuenta: true,
      fuenteId: seca.id,
      tipo: "seca",
      personaLat: seca.lat,
      personaLon: seca.lon,
    });

    expect(cat.cercanas({ ...ROMA }).some((f) => f.idExterno === "seca-cerca")).toBe(
      true,
    );
    const sed = cat.masCercana({ ...ROMA });
    expect(sed?.idExterno).toBe("usable");
    expect(sed?.estado).toBe("en-servicio");
  });

  it("modo sed: a igual distancia prioriza en-servicio sobre desconocido", () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar([
      {
        idExterno: "desconocida",
        lat: ROMA.lat + 0.002,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
      {
        idExterno: "servida",
        lat: ROMA.lat + 0.002,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
        estadoMunicipal: "en-servicio",
      },
    ]);
    expect(cat.masCercana({ ...ROMA })?.idExterno).toBe("servida");
  });

  it("modo sed: a igual distancia y en-servicio, prioriza la más fresca", () => {
    let ahora = new Date("2026-09-01T10:00:00.000Z");
    const cat = new InMemoryFuenteCatalog({
      ...deps(),
      ahora: () => ahora,
    });
    cat.importar([
      {
        idExterno: "vieja-igual-dist",
        lat: ROMA.lat + 0.002,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
        estadoMunicipal: "en-servicio",
      },
    ]);
    ahora = new Date("2026-09-14T10:00:00.000Z");
    cat.importar([
      {
        idExterno: "fresca",
        lat: ROMA.lat + 0.002,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
        estadoMunicipal: "en-servicio",
      },
    ]);
    const sed = cat.masCercana({ ...ROMA });
    expect(sed?.idExterno).toBe("fresca");
    expect(sed?.confirmadaHaceDias).toBe(0);
  });

  it("ficha pública: confirmadaHaceDias y aviso de reciente", async () => {
    let ahora = new Date("2026-09-14T10:00:00.000Z");
    const cat = new InMemoryFuenteCatalog({
      ...deps(),
      ahora: () => ahora,
    });
    const ok = await cat.aportar({
      personaId: "p1",
      conCuenta: true,
      lat: ROMA.lat + 0.01,
      lon: ROMA.lon,
      personaLat: ROMA.lat + 0.01,
      personaLon: ROMA.lon,
      ciudadId: "roma",
      foto: { ref: "f1", marcaTest: "cano" },
    });
    expect(ok.creada?.reciente).toBe(true);
    expect(ok.creada?.confirmadaHaceDias).toBe(0);

    cat.importar([
      {
        idExterno: "confirmada",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
        estadoMunicipal: "en-servicio",
      },
    ]);
    ahora = new Date("2026-09-20T10:00:00.000Z");
    const ficha = cat.detalle(
      cat.cercanas({ ...ROMA }).find((f) => f.idExterno === "confirmada")!.id,
      ROMA,
    )!;
    expect(ficha.confirmadaHaceDias).toBe(6);
    expect(ficha.estado).toBe("en-servicio");
  });

  it("catálogo acotado a ciudad activa: Roma sí, ciudad inactiva no mezcla", () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar([
      {
        idExterno: "roma-1",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
    expect(cat.cercanas({ ...ROMA, ciudadId: "roma" })).toHaveLength(1);
    expect(
      cat.cercanas({ lat: 40.4168, lon: -3.7038, ciudadId: "madrid" }),
    ).toHaveLength(0);
  });

  it("aporte exige cuenta + presencia + foto; publica como reciente; duplicado probable avisa", async () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar([
      {
        idExterno: "existente",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
    // Sin cuenta → bloqueado
    await expect(
      cat.aportar({
        personaId: "anon",
        conCuenta: false,
        lat: ROMA.lat,
        lon: ROMA.lon,
        personaLat: ROMA.lat,
        personaLon: ROMA.lon,
        ciudadId: "roma",
        foto: { ref: "f1", marcaTest: "cano" },
      }),
    ).rejects.toThrow(/cuenta/i);
    // Sin presencia → bloqueado
    await expect(
      cat.aportar({
        personaId: "p1",
        conCuenta: true,
        lat: 41.0,
        lon: 12.0,
        personaLat: ROMA.lat,
        personaLon: ROMA.lon,
        ciudadId: "roma",
        foto: { ref: "f1", marcaTest: "cano" },
      }),
    ).rejects.toThrow(/presencia/i);
    // Junto a pin existente → duplicado probable (no crea en silencio)
    const dup = await cat.aportar({
      personaId: "p1",
      conCuenta: true,
      lat: ROMA.lat + 0.00005,
      lon: ROMA.lon,
      personaLat: ROMA.lat,
      personaLon: ROMA.lon,
      ciudadId: "roma",
      foto: { ref: "f1", marcaTest: "cano" },
    });
    expect(dup.duplicado?.fuenteExistenteId).toBeDefined();
    expect(dup.creada).toBeUndefined();
    // Lejos de todo → crea con aviso de reciente
    const ok = await cat.aportar({
      personaId: "p1",
      conCuenta: true,
      lat: ROMA.lat + 0.01,
      lon: ROMA.lon,
      personaLat: ROMA.lat + 0.01,
      personaLon: ROMA.lon,
      ciudadId: "roma",
      foto: { ref: "f2", marcaTest: "cano" },
    });
    expect(ok.creada?.reciente).toBe(true);
  });

  it("revisión fake: 4 decisiones (explícita y ornamental bloquean, duda avisa, caño publica)", async () => {
    const cat = new InMemoryFuenteCatalog(deps());
    const base = {
      personaId: "p1",
      conCuenta: true,
      ciudadId: "roma",
      lat: ROMA.lat + 0.02,
      lon: ROMA.lon,
      personaLat: ROMA.lat + 0.02,
      personaLon: ROMA.lon,
    };
    await expect(
      cat.aportar({ ...base, foto: { ref: "x", marcaTest: "explicita" } }),
    ).rejects.toThrow(/bloqueada/i);
    await expect(
      cat.aportar({ ...base, foto: { ref: "x", marcaTest: "ornamental" } }),
    ).rejects.toThrow(/ornamental|no-fuente/i);
    const duda = await cat.aportar({
      ...base,
      lat: ROMA.lat + 0.03,
      personaLat: ROMA.lat + 0.03,
      foto: { ref: "x", marcaTest: "duda" },
    });
    expect(duda.revision?.veredicto).toBe("aviso-reforzado");
    expect(duda.creada?.reciente).toBe(true);
  });

  it("señal en 2 taps: sin foto obligatoria, con cuenta y presencia; actualiza frescura", async () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar([
      {
        idExterno: "s1",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
    const f = cat.masCercana({ ...ROMA })!;
    const r = await cat.senalar({
      personaId: "p1",
      conCuenta: true,
      fuenteId: f.id,
      tipo: "respaldo",
      personaLat: ROMA.lat,
      personaLon: ROMA.lon,
    });
    expect(r.fuente.estado).toBe("en-servicio");
    expect(r.fuente.lastConfirmedAt).not.toBeNull();
  });

  it("atributos: solo conteo ≥1 visibles, orden desc, una marca por persona", async () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar([
      {
        idExterno: "at1",
        lat: ROMA.lat,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" },
      },
    ]);
    const f = cat.masCercana({ ...ROMA })!;
    expect(cat.detalle(f.id)?.atributosVisibles).toEqual([]);
    await cat.marcarAtributo({
      personaId: "p1",
      conCuenta: true,
      fuenteId: f.id,
      atributo: "en-sombra",
      personaLat: ROMA.lat,
      personaLon: ROMA.lon,
    });
    await cat.marcarAtributo({
      personaId: "p2",
      conCuenta: true,
      fuenteId: f.id,
      atributo: "en-sombra",
      personaLat: ROMA.lat,
      personaLon: ROMA.lon,
    });
    await cat.marcarAtributo({
      personaId: "p1",
      conCuenta: true,
      fuenteId: f.id,
      atributo: "accesible",
      personaLat: ROMA.lat,
      personaLon: ROMA.lon,
    });
    // Doble marca misma persona no suma
    await cat.marcarAtributo({
      personaId: "p1",
      conCuenta: true,
      fuenteId: f.id,
      atributo: "en-sombra",
      personaLat: ROMA.lat,
      personaLon: ROMA.lon,
    });
    const det = cat.detalle(f.id)!;
    expect(det.atributosVisibles.map((a) => [a.id, a.conteo])).toEqual([
      ["en-sombra", 2],
      ["accesible", 1],
    ]);
  });

  it("favoritos exigen cuenta; snapshot sed devuelve ≤20 con antigüedad", async () => {
    const cat = new InMemoryFuenteCatalog(deps());
    cat.importar(
      Array.from({ length: 25 }, (_, i) => ({
        idExterno: `f${i}`,
        lat: ROMA.lat + i * 0.001,
        lon: ROMA.lon,
        ciudadId: "roma",
        tags: { amenity: "drinking_water" as const },
      })),
    );
    const f = cat.masCercana({ ...ROMA })!;
    await expect(
      cat.toggleFavorito({ personaId: "anon", conCuenta: false, fuenteId: f.id }),
    ).rejects.toThrow(/cuenta/i);
    await cat.toggleFavorito({ personaId: "p1", conCuenta: true, fuenteId: f.id });
    expect(cat.favoritosDe("p1")).toHaveLength(1);
    const snap = cat.snapshotSed({ ...ROMA });
    expect(snap.fuentes.length).toBeLessThanOrEqual(20);
    expect(snap.generadaEn).toBeDefined();
  });
});
