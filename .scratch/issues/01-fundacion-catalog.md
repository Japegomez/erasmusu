## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Fundación del repo: scaffold de app React Native (un codebase iOS + Android; toolchain a elegir en el ticket y dejar registrado), scaffold de backend/API + datastore (proveedor a elegir), la interfaz de la seam `FuenteCatalog` con adapters fake en memoria (PresenceGate, PhotoReview, FountainImporter), harness de tests y CI que compila y testea en cada push. Nada de producto visible aún: este ticket deja el terreno donde los demás construyen.

## Acceptance criteria

- [ ] Clon fresco: la app compila para iOS y Android y el backend arranca en local con instrucciones escritas en el repo.
- [ ] `FuenteCatalog` existe como interfaz única del dominio con operaciones de descubrir, detalle, aportar, señalar, atributos, favoritos y snapshot sed (nombres exactos a fijar en el ticket).
- [ ] Al menos un test de contrato del catálogo en verde usando solo adapters fake (sin GPS, IA, OSM ni red reales).
- [ ] CI en GitHub: build + tests en cada push, en verde.
- [ ] Toolchain elegida (RN/Expo, backend, DB) registrada en un comentario del ticket para tickets posteriores.

## Blocked by

- None — can start immediately.
