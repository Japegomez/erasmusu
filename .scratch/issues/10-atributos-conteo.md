## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Atributos de la lista cerrada (accesible, caudal rápido, en sombra, asientos cerca, agua muy fría, apta para perros): marcar/desmarcar con cuenta y presencia, una marca por persona, fuente y atributo, con conteos implícitos. En ficha solo se muestran etiquetas con conteo ≥ 1, ordenadas de mayor a menor y con las altas destacadas.

## Acceptance criteria

- [ ] Marcar exige cuenta + presencia; desmarcar resta del conteo.
- [ ] Ficha muestra solo etiquetas con ≥1, ordenadas desc, altas destacadas; cero marcas = no aparece.
- [ ] Lista cerrada: sin forma de crear etiquetas nuevas en v1.
- [ ] Tests del catálogo: conteos, orden, umbral de visibilidad, una-marca-por-persona.

## Blocked by

- #{{T1}} — Seam `FuenteCatalog`.
- #{{T2}} — Fuentes sobre las que marcar.
- #{{T3A}} — PresenceGate real.
- #{{T4}} — Cuentas (marcar exige cuenta).
