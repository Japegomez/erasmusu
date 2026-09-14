import {
  RADIO_PRESENCIA_M,
  type FountainImporter,
  type PhotoReview,
  type PresenceGate,
  type FuenteBruta,
} from "./adapters.js";
import {
  ATRIBUTOS_V1,
  type AtributoId,
  type AtributoVisible,
  type DuplicadoProbable,
  type FotoRef,
  type Fuente,
  type FuentePublica,
  type RevisionFoto,
  type SedSnapshot,
  type Senal,
  type TipoSenal,
  esAtributoV1,
} from "./types.js";

export interface CatalogDeps {
  presence: PresenceGate;
  photos: PhotoReview;
  importer: FountainImporter;
  ahora?: () => Date;
}

/** Umbral de duplicado probable al aportar (~50 m, ADR-0008). */
export const RADIO_DUPLICADO_M = 50;

export interface CercanasArgs {
  lat: number;
  lon: number;
  ciudadId?: string;
  limite?: number;
}

export interface AportarInput {
  personaId: string;
  conCuenta: boolean;
  ciudadId: string;
  lat: number;
  lon: number;
  personaLat: number;
  personaLon: number;
  foto: FotoRef;
}

export interface AportarResultado {
  creada?: FuentePublica;
  duplicado?: DuplicadoProbable;
  revision: RevisionFoto;
}

export interface SenalarInput {
  personaId: string;
  conCuenta: boolean;
  fuenteId: string;
  tipo: TipoSenal;
  personaLat: number;
  personaLon: number;
  foto?: FotoRef;
}

export interface MarcarAtributoInput {
  personaId: string;
  conCuenta: boolean;
  fuenteId: string;
  atributo: string;
  personaLat: number;
  personaLon: number;
}

/**
 * Seam profunda `FuenteCatalog`: única interfaz del dominio de fuentes.
 * UI, widgets y tests solo llaman aquí (spec v1, historia 36-37).
 *
 * T1 trae la mecánica honesta mínima con fakes en memoria. La matemática
 * completa de confianza (quórum + proporción + asimetría, T6b) y el
 * PhotoReview real (T5b) se enchufan detrás sin cambiar esta interfaz.
 */
export class InMemoryFuenteCatalog {
  private fuentes = new Map<string, Fuente>();
  private porExterno = new Map<string, string>();
  private senales: Senal[] = [];
  private favoritos = new Map<string, Set<string>>();
  private aportesPorDia = new Map<string, number>();
  private senalesPorDia = new Map<string, number>();
  private seq = 1;
  private presence: PresenceGate;
  private photos: PhotoReview;
  private importer: FountainImporter;
  private ahora: () => Date;

  constructor(deps: CatalogDeps) {
    this.presence = deps.presence;
    this.photos = deps.photos;
    this.importer = deps.importer;
    this.ahora = deps.ahora ?? (() => new Date());
  }

  private hoy(): string {
    return this.ahora().toISOString().slice(0, 10);
  }

  // ---- Import ----

  /** Importa candidatas; devuelve nº de creadas (idempotente por idExterno). */
  importar(candidatas: FuenteBruta[]): number {
    const potables = this.importer.filtrarPotables(candidatas);
    let creadas = 0;
    for (const c of potables) {
      if (this.porExterno.has(c.idExterno)) continue;
      const id = `f-${this.seq++}`;
      const fuente: Fuente = {
        id,
        ciudadId: c.ciudadId,
        lat: c.lat,
        lon: c.lon,
        fotos: [],
        origen: "importada",
        reciente: false,
        oculta: false,
        estado: "desconocido",
        lastConfirmedAt: null,
        atributos: {
          accesible: [],
          "caudal-rapido": [],
          "en-sombra": [],
          "asientos-cerca": [],
          "agua-muy-fria": [],
          "apta-perros": [],
        },
        idExterno: c.idExterno,
      };
      this.fuentes.set(id, fuente);
      this.porExterno.set(c.idExterno, id);
      creadas++;
    }
    return creadas;
  }

  // ---- Descubrimiento (sin cuenta, ignora ocultas) ----

  cercanas(args: CercanasArgs): FuentePublica[] {
    const ciudadId = args.ciudadId ?? "roma";
    const limite = args.limite ?? 50;
    return [...this.fuentes.values()]
      .filter((f) => !f.oculta && f.ciudadId === ciudadId)
      .map((f) => this.aPublica(f, args.lat, args.lon))
      .sort((a, b) => a.distanciaM - b.distanciaM)
      .slice(0, limite);
  }

  masCercana(args: CercanasArgs): FuentePublica | undefined {
    return this.cercanas(args)[0];
  }

  detalle(id: string, desde?: { lat: number; lon: number }): FuentePublica | undefined {
    const f = this.fuentes.get(id);
    if (!f) return undefined;
    return this.aPublica(f, desde?.lat ?? f.lat, desde?.lon ?? f.lon);
  }

  // ---- Aporte (pin + foto, cuenta + presencia, 5/día, duplicado, reciente) ----

  async aportar(input: AportarInput): Promise<AportarResultado> {
    if (!input.conCuenta) throw new Error("Aportar exige cuenta (gratis).");
    if (!input.foto?.ref) throw new Error("Aportar exige foto obligatoria.");
    if (
      !this.presence.estaPresente(
        input.personaLat,
        input.personaLon,
        input.lat,
        input.lon,
      )
    ) {
      throw new Error(
        `Sin presencia (~${RADIO_PRESENCIA_M} m): acércate a la fuente para aportar.`,
      );
    }
    const key = `${input.personaId}:${this.hoy()}:aportes`;
    if ((this.aportesPorDia.get(key) ?? 0) >= 5) {
      throw new Error("Tope de 5 aportes por persona y día.");
    }
    const revision = await this.photos.revisar(input.foto, {
      lat: input.lat,
      lon: input.lon,
    });
    if (revision.veredicto === "bloquear-explicito") {
      throw new Error(`Foto bloqueada: ${revision.mensaje}`);
    }
    if (revision.veredicto === "bloquear-no-fuente") {
      throw new Error(`No-fuente: ${revision.mensaje}`);
    }
    // Duplicado probable: avisar, no crear en silencio (ADR-0008).
    let mejor: { id: string; d: number } | undefined;
    for (const f of this.fuentes.values()) {
      if (f.oculta || f.ciudadId !== input.ciudadId) continue;
      const d = this.presence.distanciaM(input.lat, input.lon, f.lat, f.lon);
      if (d <= RADIO_DUPLICADO_M && (!mejor || d < mejor.d)) {
        mejor = { id: f.id, d };
      }
    }
    if (mejor) {
      return {
        duplicado: { fuenteExistenteId: mejor.id, distanciaM: mejor.d },
        revision,
      };
    }
    this.aportesPorDia.set(key, (this.aportesPorDia.get(key) ?? 0) + 1);
    const id = `f-${this.seq++}`;
    const ahoraIso = this.ahora().toISOString();
    const fuente: Fuente = {
      id,
      ciudadId: input.ciudadId,
      lat: input.lat,
      lon: input.lon,
      fotos: [input.foto],
      origen: "aportada",
      reciente: true,
      oculta: false,
      estado: "en-servicio",
      lastConfirmedAt: ahoraIso,
      atributos: {
        accesible: [],
        "caudal-rapido": [],
        "en-sombra": [],
        "asientos-cerca": [],
        "agua-muy-fria": [],
        "apta-perros": [],
      },
    };
    this.fuentes.set(id, fuente);
    return { creada: this.aPublica(fuente, input.personaLat, input.personaLon), revision };
  }

  // ---- Señal (2 taps, sin foto obligatoria, cuenta + presencia) ----

  async senalar(
    input: SenalarInput,
  ): Promise<{ fuente: FuentePublica; senalId: string }> {
    if (!input.conCuenta) throw new Error("Señalar exige cuenta (gratis).");
    const fuente = this.fuentes.get(input.fuenteId);
    if (!fuente) throw new Error("Fuente no encontrada.");
    if (
      !this.presence.estaPresente(
        input.personaLat,
        input.personaLon,
        fuente.lat,
        fuente.lon,
      )
    ) {
      throw new Error(
        `Sin presencia (~${RADIO_PRESENCIA_M} m): acércate para señalar.`,
      );
    }
    const existente = this.senales.find(
      (s) => s.personaId === input.personaId && s.fuenteId === input.fuenteId,
    );
    if (!existente) {
      const key = `${input.personaId}:${this.hoy()}:senales`;
      if ((this.senalesPorDia.get(key) ?? 0) >= 5) {
        throw new Error("Tope de 5 señales por persona y día.");
      }
      this.senalesPorDia.set(key, (this.senalesPorDia.get(key) ?? 0) + 1);
    }
    const ahoraIso = this.ahora().toISOString();
    if (existente) {
      // Una señal activa por persona y fuente: cambiarla sustituye, no suma.
      existente.tipo = input.tipo;
      existente.creadaEn = ahoraIso;
      existente.conPresencia = true;
    } else {
      this.senales.push({
        id: `s-${this.seq++}`,
        personaId: input.personaId,
        fuenteId: input.fuenteId,
        tipo: input.tipo,
        creadaEn: ahoraIso,
        conPresencia: true,
        ...(input.foto ? { foto: input.foto } : {}),
      });
    }
    // Estado operativo + frescura (reglas finas de caducidad en T6a).
    if (input.tipo === "respaldo") {
      fuente.estado = "en-servicio";
      fuente.lastConfirmedAt = ahoraIso;
    } else if (input.tipo === "seca") {
      fuente.estado = "seca";
      fuente.lastConfirmedAt = ahoraIso;
    } else {
      fuente.estado = "incidencia-temporal";
      fuente.lastConfirmedAt = ahoraIso;
    }
    // TODO(T6b): quórum + proporción + asimetría, graduación de reciente.
    return {
      fuente: this.aPublica(fuente, input.personaLat, input.personaLon),
      senalId: existente?.id ?? this.senales[this.senales.length - 1]!.id,
    };
  }

  // ---- Atributos (lista cerrada, una marca por persona) ----

  async marcarAtributo(input: MarcarAtributoInput): Promise<FuentePublica> {
    if (!input.conCuenta) throw new Error("Marcar atributos exige cuenta.");
    if (!esAtributoV1(input.atributo)) {
      throw new Error("Atributo fuera de la lista cerrada v1 (6).");
    }
    const atributo = input.atributo as AtributoId;
    const fuente = this.fuentes.get(input.fuenteId);
    if (!fuente) throw new Error("Fuente no encontrada.");
    if (
      !this.presence.estaPresente(
        input.personaLat,
        input.personaLon,
        fuente.lat,
        fuente.lon,
      )
    ) {
      throw new Error(`Sin presencia (~${RADIO_PRESENCIA_M} m).`);
    }
    const lista = fuente.atributos[atributo];
    if (!lista.includes(input.personaId)) lista.push(input.personaId);
    return this.aPublica(fuente, input.personaLat, input.personaLon);
  }

  async desmarcarAtributo(input: MarcarAtributoInput): Promise<FuentePublica> {
    if (!esAtributoV1(input.atributo)) {
      throw new Error("Atributo fuera de la lista cerrada v1 (6).");
    }
    const fuente = this.fuentes.get(input.fuenteId);
    if (!fuente) throw new Error("Fuente no encontrada.");
    const atributo = input.atributo as AtributoId;
    fuente.atributos[atributo] = fuente.atributos[atributo].filter(
      (p) => p !== input.personaId,
    );
    return this.aPublica(fuente, input.personaLat, input.personaLon);
  }

  // ---- Favoritos (cuenta, gratis, lista plana) + snapshot sed ----

  async toggleFavorito(args: {
    personaId: string;
    conCuenta: boolean;
    fuenteId: string;
  }): Promise<{ favorito: boolean }> {
    if (!args.conCuenta) throw new Error("Favoritos exigen cuenta (gratis).");
    if (!this.fuentes.has(args.fuenteId)) throw new Error("Fuente no encontrada.");
    let set = this.favoritos.get(args.personaId);
    if (!set) {
      set = new Set();
      this.favoritos.set(args.personaId, set);
    }
    if (set.has(args.fuenteId)) {
      set.delete(args.fuenteId);
      return { favorito: false };
    }
    set.add(args.fuenteId);
    return { favorito: true };
  }

  favoritosDe(personaId: string, desde?: { lat: number; lon: number }): FuentePublica[] {
    const ids = this.favoritos.get(personaId) ?? new Set();
    return [...ids]
      .map((id) => this.fuentes.get(id))
      .filter((f): f is Fuente => !!f)
      .map((f) => this.aPublica(f, desde?.lat ?? f.lat, desde?.lon ?? f.lon));
  }

  snapshotSed(args: CercanasArgs): SedSnapshot {
    return {
      generadaEn: this.ahora().toISOString(),
      lat: args.lat,
      lon: args.lon,
      fuentes: this.cercanas({ ...args, limite: 20 }),
    };
  }

  // ---- Vista pública ----

  private aPublica(f: Fuente, lat: number, lon: number): FuentePublica {
    const distanciaM = this.presence.distanciaM(lat, lon, f.lat, f.lon);
    const visibles: AtributoVisible[] = (ATRIBUTOS_V1 as readonly AtributoId[])
      .map((id) => ({ id, conteo: f.atributos[id].length }))
      .filter((a) => a.conteo >= 1)
      .sort((a, b) => b.conteo - a.conteo)
      .map((a) => ({ ...a, destacada: a.conteo >= 2 }));
    return {
      id: f.id,
      ciudadId: f.ciudadId,
      lat: f.lat,
      lon: f.lon,
      fotos: f.fotos,
      origen: f.origen,
      reciente: f.reciente,
      oculta: f.oculta,
      estado: f.estado,
      lastConfirmedAt: f.lastConfirmedAt,
      idExterno: f.idExterno,
      distanciaM,
      atributosVisibles: visibles,
      confirmadaHaceDias: f.lastConfirmedAt
        ? Math.max(
            0,
            Math.floor(
              (this.ahora().getTime() - new Date(f.lastConfirmedAt).getTime()) /
                86400000,
            ),
          )
        : null,
    };
  }
}
