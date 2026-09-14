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
  /** Estado municipal cuando el feed lo trae (p. ej. Madrid "en servicio"). */
  estadoMunicipal?: string;
}

/** Seam interna: FountainImporter (OSM solo-potable, multi-fuente listo). */
export interface FountainImporter {
  filtrarPotables(candidatas: FuenteBruta[]): FuenteBruta[];
}

/**
 * Fake con la regla potable-only de T2: acepta `amenity=drinking_water`
 * o `drinking_water=yes`; excluye `amenity=fountain` decorativa sin
 * potabilidad. El diseño multi-fuente (Madrid "en servicio") llega en T2.
 */
export class FakeFountainImporter implements FountainImporter {
  filtrarPotables(candidatas: FuenteBruta[]): FuenteBruta[] {
    return candidatas.filter((c) => {
      const amenity = c.tags["amenity"];
      const dw = c.tags["drinking_water"];
      if (amenity === "drinking_water" || dw === "yes") return true;
      return false;
    });
  }
}
