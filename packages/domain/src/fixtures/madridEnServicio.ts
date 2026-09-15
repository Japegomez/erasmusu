/**
 * Fixture Madrid “en servicio” / OPERATIVO (ADR-0012).
 * Campos alineados con el feed municipal ArcGIS (CODIGO_INTERNO, ESTADO).
 * Coordenadas WGS84 de ejemplo (el MapServer público a veces no expone geometry).
 * No es go-live de Madrid: solo verifica la segunda fuente configurable.
 */
export const MADRID_EN_SERVICIO_FIXTURE = [
  {
    codigoInterno: "FUE_01_0001",
    lat: 40.4255,
    lon: -3.7082,
    estado: "OPERATIVO",
  },
  {
    codigoInterno: "FUE_01_0009",
    lat: 40.4142,
    lon: -3.7115,
    estado: "EN SERVICIO",
  },
  {
    codigoInterno: "FUE_99_9999",
    lat: 40.4168,
    lon: -3.7038,
    estado: "FUERA DE SERVICIO",
  },
] as const;
