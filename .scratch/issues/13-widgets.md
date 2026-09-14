## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Widgets iOS/Android del modo sed (“fuente a ~X m →”) leyendo el snapshot que produce `FuenteCatalog`, con deep-link a la app. Demo: widget instalado muestra distancia sin abrir la app.

## Acceptance criteria

- [ ] Widget iOS y widget Android muestran fuente cercana + distancia aproximada.
- [ ] Leen el mismo snapshot del catálogo (no lógica duplicada).
- [ ] Tap abre la app en la ficha/modo sed.
- [ ] Sin red muestran último snapshot con antigüedad o estado vacío honesto.

## Blocked by

- #{{T3B}} — Caché/snapshot offline.
