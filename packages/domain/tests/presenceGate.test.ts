import { describe, expect, it } from "vitest";
import {
  HaversinePresenceGate,
  RADIO_PRESENCIA_M,
  distanciaM,
} from "../src/adapters.js";

/** Desplaza un punto hacia el norte en metros (≈1° lat = 111_320 m). */
function norteDe(lat: number, lon: number, metros: number) {
  return { lat: lat + metros / 111_320, lon };
}

const ORIGEN = { lat: 41.9028, lon: 12.4964 };

describe("HaversinePresenceGate (contrato T3a)", () => {
  const gate = new HaversinePresenceGate();

  it("distanciaM coincide con el helper haversiano exportado", () => {
    const p = norteDe(ORIGEN.lat, ORIGEN.lon, 100);
    expect(gate.distanciaM(ORIGEN.lat, ORIGEN.lon, p.lat, p.lon)).toBeCloseTo(
      distanciaM(ORIGEN.lat, ORIGEN.lon, p.lat, p.lon),
      6,
    );
  });

  it("estaPresente: dentro del radio (~150 m) sí, fuera no", () => {
    const dentro = norteDe(ORIGEN.lat, ORIGEN.lon, 149);
    const fuera = norteDe(ORIGEN.lat, ORIGEN.lon, 151);
    const lejos = norteDe(ORIGEN.lat, ORIGEN.lon, 300);

    expect(
      gate.estaPresente(ORIGEN.lat, ORIGEN.lon, ORIGEN.lat, ORIGEN.lon),
    ).toBe(true);
    expect(
      gate.estaPresente(ORIGEN.lat, ORIGEN.lon, dentro.lat, dentro.lon),
    ).toBe(true);
    expect(
      gate.estaPresente(ORIGEN.lat, ORIGEN.lon, fuera.lat, fuera.lon),
    ).toBe(false);
    expect(
      gate.estaPresente(ORIGEN.lat, ORIGEN.lon, lejos.lat, lejos.lon),
    ).toBe(false);

    expect(gate.distanciaM(ORIGEN.lat, ORIGEN.lon, dentro.lat, dentro.lon)).toBeLessThanOrEqual(
      RADIO_PRESENCIA_M,
    );
    expect(gate.distanciaM(ORIGEN.lat, ORIGEN.lon, fuera.lat, fuera.lon)).toBeGreaterThan(
      RADIO_PRESENCIA_M,
    );
  });
});
