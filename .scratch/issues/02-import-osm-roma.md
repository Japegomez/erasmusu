## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Importar fuentes potables de Roma desde OpenStreetMap (solo potable: `amenity=drinking_water` o `drinking_water=yes`; excluir `amenity=fountain` decorativa sin potabilidad) y mostrarlas en mapa/lista funcionando **sin login**. El importador nace con forma multi-fuente (Madrid “en servicio” como referencia de diseño, sin go-live). Demo: abrir la app y ver pines reales de Roma.

## Acceptance criteria

- [ ] Pines potables reales de Roma visibles en mapa y lista, sin cuenta.
- [ ] Monumentos ornamentales no potables (caso Trevi) ausentes del catálogo aunque existan en OSM.
- [ ] El importador acepta una segunda fuente municipal configurable (verificado con fixture, p. ej. formato “en servicio”).
- [ ] Re-import no duplica: los mismos puntos OSM actualizan en vez de crear.
- [ ] Tests del catálogo: import potable-only + idempotencia con fakes.

## Blocked by

- #{{T1}} — Fundación + seam `FuenteCatalog`.
