/**
 * Vocabulario de dominio según CONTEXT.md (v1: solo Roma activa).
 * FuenteCatalog es la única seam profunda del dominio de fuentes.
 */

/** Ciudad soportada — v1 solo `roma` activa (ADR-0011). */
export interface Ciudad {
  id: string;
  nombre: string;
  /** Solo Roma en v1; Barcelona/Madrid/Bilbao u otras llegan después. */
  activaEnProducto: boolean;
}

export const CIUDADES_SOPORTADAS: Ciudad[] = [
  { id: "roma", nombre: "Roma", activaEnProducto: true },
  { id: "barcelona", nombre: "Barcelona", activaEnProducto: false },
  { id: "madrid", nombre: "Madrid", activaEnProducto: false },
  { id: "bilbao", nombre: "Bilbao", activaEnProducto: false },
];

/**
 * Atributo de fuente — lista cerrada v1 (6). Cada etiqueta lleva conteo
 * de personas distintas; en ficha solo se muestran las de conteo ≥ 1,
 * ordenadas desc, destacando las altas.
 */
export const ATRIBUTOS_V1 = [
  "accesible",
  "caudal-rapido",
  "en-sombra",
  "asientos-cerca",
  "agua-muy-fria",
  "apta-perros",
] as const;

export type AtributoId = (typeof ATRIBUTOS_V1)[number];

export function esAtributoV1(v: string): v is AtributoId {
  return (ATRIBUTOS_V1 as readonly string[]).includes(v);
}

/** Estado operativo con frescura (lastConfirmedAt). */
export type EstadoOperativo =
  | "en-servicio"
  | "seca"
  | "incidencia-temporal"
  | "desconocido";

export type OrigenFuente = "importada" | "aportada";

/** Foto aportada (refs, no binarios en dominio). */
export interface FotoRef {
  /** Id/URI opaco de almacenamiento. */
  ref: string;
  /** Marca solo para tests/fakes: dirige el veredicto del FakePhotoReview. */
  marcaTest?: "cano" | "duda" | "ornamental" | "explicita";
  /** EXIF GPS si existe (no bloquea si falta — ADR-0003). */
  exifLat?: number;
  exifLon?: number;
}

export interface Fuente {
  id: string;
  ciudadId: string;
  lat: number;
  lon: number;
  fotos: FotoRef[];
  origen: OrigenFuente;
  /** Aviso de reciente: aportada aún sin 2 respaldos ajenos (ADR-0001). */
  reciente: boolean;
  /** Ocultación blanda: sale de nearest/mapa pero deja rastro. */
  oculta: boolean;
  estado: EstadoOperativo;
  lastConfirmedAt: string | null;
  /** Atributo -> personas distintas que lo marcaron (una marca por persona/fuente/atributo). */
  atributos: Record<AtributoId, string[]>;
  /** Id externo del importador (OSM node id…) para idempotencia. */
  idExterno?: string;
}

/** Vista pública de ficha: atributos visibles (conteo ≥ 1, orden desc). */
export interface AtributoVisible {
  id: AtributoId;
  conteo: number;
  destacada: boolean;
}

export interface FuentePublica extends Omit<Fuente, "atributos"> {
  distanciaM: number;
  atributosVisibles: AtributoVisible[];
  confirmadaHaceDias: number | null;
}

export type TipoSenal =
  | "respaldo"
  | "no-esta"
  | "no-potable"
  | "seca";

export function esProblema(t: TipoSenal): boolean {
  return t === "no-esta" || t === "no-potable" || t === "seca";
}

export interface Senal {
  id: string;
  personaId: string;
  fuenteId: string;
  tipo: TipoSenal;
  creadaEn: string;
  conPresencia: boolean;
  foto?: FotoRef;
}

export interface Persona {
  id: string;
  /** Cuenta requerida para aportar/señalar/favoritos (ADR-0007). */
  conCuenta: boolean;
  esAdmin: boolean;
}

/** Resultado de duplicado probable (ADR-0008): avisar, no bloquear. */
export interface DuplicadoProbable {
  fuenteExistenteId: string;
  distanciaM: number;
}

export type VeredictoFoto =
  | "publicar"
  | "aviso-reforzado"
  | "bloquear-explicito"
  | "bloquear-no-fuente";

export interface RevisionFoto {
  veredicto: VeredictoFoto;
  mensaje: string;
  /** EXIF coincidente (~150 m) suma confianza; nunca bloquea en duro. */
  confianzaExif: "coincide" | "ausente-o-desajuste";
}

/** Snapshot sed: ~20 cercanas con antigüedad (offline). */
export interface SedSnapshot {
  generadaEn: string;
  lat: number;
  lon: number;
  fuentes: FuentePublica[];
}
