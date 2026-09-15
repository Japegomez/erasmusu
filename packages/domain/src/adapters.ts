import type { FotoRef, RevisionFoto } from "./types.js";

/** Radio de presencia: ~150 m (CONTEXT.md, ADR-0001). */
export const RADIO_PRESENCIA_M = 150;

/** Distancia haversiana en metros. */
export function distanciaM(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Seam interna: PresenceGate (~150 m). */
export interface PresenceGate {
  distanciaM(aLat: number, aLon: number, bLat: number, bLon: number): number;
  estaPresente(
    personaLat: number,
    personaLon: number,
    fuenteLat: number,
    fuenteLon: number,
    radioM?: number,
  ): boolean;
}

export class HaversinePresenceGate implements PresenceGate {
  distanciaM(aLat: number, aLon: number, bLat: number, bLon: number): number {
    return distanciaM(aLat, aLon, bLat, bLon);
  }
  estaPresente(
    personaLat: number,
    personaLon: number,
    fuenteLat: number,
    fuenteLon: number,
    radioM: number = RADIO_PRESENCIA_M,
  ): boolean {
    return distanciaM(personaLat, personaLon, fuenteLat, fuenteLon) <= radioM;
  }
}

/** Seam interna: PhotoReview (explícito + tipo + EXIF, ADR-0003). */
export interface PhotoReview {
  revisar(
    foto: FotoRef,
    pin: { lat: number; lon: number },
  ): Promise<RevisionFoto>;
}

/**
 * Fake determinista para tests: el veredicto lo dirige `foto.marcaTest`.
 * - "cano" → publicar (sigue siendo reciente)
 * - "duda" → aviso-reforzado
 * - "ornamental" → bloquear-no-fuente
 * - "explicita" → bloquear-explicito
 */
export class FakePhotoReview implements PhotoReview {
  async revisar(
    foto: FotoRef,
    pin: { lat: number; lon: number },
  ): Promise<RevisionFoto> {
    const marca = foto.marcaTest ?? "cano";
    const confianzaExif =
      foto.exifLat !== undefined &&
      foto.exifLon !== undefined &&
      distanciaM(foto.exifLat, foto.exifLon, pin.lat, pin.lon) <= RADIO_PRESENCIA_M
        ? ("coincide" as const)
        : ("ausente-o-desajuste" as const);
    switch (marca) {
      case "explicita":
        return {
          veredicto: "bloquear-explicito",
          mensaje: "Foto bloqueada: contenido no permitido. Sube una foto del caño.",
          confianzaExif,
        };
      case "ornamental":
        return {
          veredicto: "bloquear-no-fuente",
          mensaje: "Parece ornamental o no-fuente (p. ej. Trevi). Busca un caño de beber.",
          confianzaExif,
        };
      case "duda":
        return {
          veredicto: "aviso-reforzado",
          mensaje: "Duda: se publica con aviso reforzado. Confirma que sea caño potable.",
          confianzaExif,
        };
      default:
        return {
          veredicto: "publicar",
          mensaje: "OK: parece caño de beber. Se publica como reciente.",
          confianzaExif,
        };
    }
  }
}

/** Entrada bruta al importador (OSM o feed municipal). */
export interface FuenteBruta {
  idExterno: string;
  lat: number;
  lon: number;
  ciudadId: string;
  /** Etiquetas OSM relevantes. */
  tags: Record<string, string | undefined>;
  /**
   * Estado normalizado del feed municipal cuando existe
   * (`en-servicio` | `fuera-de-servicio` | texto crudo).
   */
  estadoMunicipal?: string;
}

/** Registro crudo del feed Madrid (ADR-0012; sin go-live). */
export interface MadridMunicipalRegistro {
  codigoInterno: string;
  lat: number;
  lon: number;
  /** OPERATIVO, EN SERVICIO, FUERA DE SERVICIO, etc. */
  estado: string;
  ciudadId?: string;
}

/** Elemento mínimo de Overpass / OSM JSON. */
export interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string | undefined>;
}

/** Regla potable-only OSM (wiki amenity=drinking_water / Key:drinking_water). */
export function esPotableOsm(tags: Record<string, string | undefined>): boolean {
  return tags["amenity"] === "drinking_water" || tags["drinking_water"] === "yes";
}

/** Normaliza el estado del feed Madrid a valores de dominio. */
export function normalizarEstadoMadrid(estado: string): string {
  const e = estado.trim().toLowerCase();
  if (
    e === "operativo" ||
    e === "en servicio" ||
    e === "en-servicio" ||
    e === "en_servicio"
  ) {
    return "en-servicio";
  }
  if (
    e.includes("fuera") ||
    e.includes("no operativo") ||
    e.includes("averia") ||
    e.includes("avería")
  ) {
    return "fuera-de-servicio";
  }
  return e;
}

export function parseOsmElements(
  doc: { elements?: OsmElement[] },
  ciudadId: string,
): FuenteBruta[] {
  const out: FuenteBruta[] = [];
  for (const el of doc.elements ?? []) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    out.push({
      idExterno: `osm-${el.type}-${el.id}`,
      lat,
      lon,
      ciudadId,
      tags: { ...(el.tags ?? {}) },
    });
  }
  return out;
}

export function parseMadridMunicipal(
  registros: readonly MadridMunicipalRegistro[],
): FuenteBruta[] {
  return registros.map((r) => ({
    idExterno: `madrid-${r.codigoInterno}`,
    lat: r.lat,
    lon: r.lon,
    ciudadId: r.ciudadId ?? "madrid",
    tags: { amenity: "drinking_water", source: "madrid-municipal" },
    estadoMunicipal: normalizarEstadoMadrid(r.estado),
  }));
}

/** Seam interna: FountainImporter (OSM solo-potable, multi-fuente listo). */
export interface FountainImporter {
  filtrarPotables(candidatas: FuenteBruta[]): FuenteBruta[];
  /** Segunda fuente municipal configurable (fixture Madrid “en servicio”). */
  desdeMadridMunicipal(registros: readonly MadridMunicipalRegistro[]): FuenteBruta[];
}

/**
 * Importador potable-only: acepta `amenity=drinking_water` o
 * `drinking_water=yes`; excluye `amenity=fountain` decorativa sin
 * potabilidad. Multi-fuente: `desdeMadridMunicipal` (ADR-0012).
 */
export class PotableFountainImporter implements FountainImporter {
  filtrarPotables(candidatas: FuenteBruta[]): FuenteBruta[] {
    return candidatas.filter((c) => esPotableOsm(c.tags));
  }

  desdeMadridMunicipal(
    registros: readonly MadridMunicipalRegistro[],
  ): FuenteBruta[] {
    return this.filtrarPotables(parseMadridMunicipal(registros));
  }
}

/** @deprecated Preferir `PotableFountainImporter` (mismo comportamiento). */
export const FakeFountainImporter = PotableFountainImporter;
