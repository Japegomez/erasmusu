## Padre

- #1 — Especificación: Erasmusu v1 (costura `FuenteCatalog`, Roma, gratis/sin paywall)

## Qué construir

Importar fuentes potables de Roma desde OpenStreetMap (solo potable: `amenity=drinking_water` o `drinking_water=yes`; excluir `amenity=fountain` decorativa sin potabilidad) y mostrarlas en mapa/lista funcionando **sin login**. El importador nace con forma multi-fuente (Madrid “en servicio” como referencia de diseño, sin go-live). Demo: abrir la app y ver pines reales de Roma.

## Criterios de aceptación

- [x] Pines potables reales de Roma visibles en mapa y lista, sin cuenta.
- [x] Monumentos ornamentales no potables (caso Trevi) ausentes del catálogo aunque existan en OSM.
- [x] El importador acepta una segunda fuente municipal configurable (verificado con fixture, p. ej. formato “en servicio”).
- [x] Re-import no duplica: los mismos puntos OSM actualizan en vez de crear.
- [x] Tests del catálogo: import potable-only + idempotencia con fakes.

## Investigación (T2)

Otras fuentes evaluadas en `docs/research/fuentes-datos-import.md` (Acea/Acquea sin API, Madrid open data, BCN fonts, Bilbao/GeoBilbao).

## Bloqueado por

- ##2 — Fundación + seam `FuenteCatalog`.
