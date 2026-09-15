## Padre

- #1 — Especificación: Erasmusu v1 (costura `FuenteCatalog`, Roma, gratis/sin paywall)

## Qué construir

Atributos de la lista cerrada (accesible, caudal rápido, en sombra, asientos cerca, agua muy fría, apta para perros): marcar/desmarcar con cuenta y presencia, una marca por persona, fuente y atributo, con conteos implícitos. En ficha solo se muestran etiquetas con conteo ≥ 1, ordenadas de mayor a menor y con las altas destacadas.

## Criterios de aceptación

- [ ] Marcar exige cuenta + presencia; desmarcar resta del conteo.
- [ ] Ficha muestra solo etiquetas con ≥1, ordenadas desc, altas destacadas; cero marcas = no aparece.
- [ ] Lista cerrada: sin forma de crear etiquetas nuevas en v1.
- [ ] Tests del catálogo: conteos, orden, umbral de visibilidad, una-marca-por-persona.

## Bloqueado por

- ##2 — Seam `FuenteCatalog`.
- ##3 — Fuentes sobre las que marcar.
- ##5 — PresenceGate real.
- ##4 — Cuentas (marcar exige cuenta).
