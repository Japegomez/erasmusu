## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Modo sed sin red: snapshot local de ~20 fuentes cercanas (datos + fotos comprimidas) producido por `FuenteCatalog`, con refresco al volver en línea e indicación de antigüedad del snapshot. Demo: modo avión tras haber abierto la app con red → el gesto sigue proponiendo fuentes.

## Acceptance criteria

- [ ] Sin red, “tengo sed” propone desde el último snapshot con nota de antigüedad.
- [ ] Al volver en línea, el snapshot se refresca.
- [ ] Fotos cacheadas comprimidas (no originales pesados).
- [ ] Tests: offline devuelve snapshot; refresh lo actualiza.

## Blocked by

- #{{T3A}} — Modo sed online (snapshot y gesto base).
