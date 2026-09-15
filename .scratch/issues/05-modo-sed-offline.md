## Padre

- #1 — Especificación: Erasmusu v1 (costura `FuenteCatalog`, Roma, gratis/sin paywall)

## Qué construir

Modo sed sin red: snapshot local de ~20 fuentes cercanas (datos + fotos comprimidas) producido por `FuenteCatalog`, con refresco al volver en línea e indicación de antigüedad del snapshot. Demo: modo avión tras haber abierto la app con red → el gesto sigue proponiendo fuentes.

## Criterios de aceptación

- [ ] Sin red, “tengo sed” propone desde el último snapshot con nota de antigüedad.
- [ ] Al volver en línea, el snapshot se refresca.
- [ ] Fotos cacheadas comprimidas (no originales pesados).
- [ ] Tests: offline devuelve snapshot; refresh lo actualiza.

## Bloqueado por

- ##5 — Modo sed online (snapshot y gesto base).
