## Padre

- #1 — Especificación: Erasmusu v1 (costura `FuenteCatalog`, Roma, gratis/sin paywall)

## Qué construir

Flujo de aporte (crear/corregir fuente): pin + foto obligatoria, con cuenta y presencia (~150 m), tope 5/día, rama de duplicado probable (ofrece señalar o corregir la existente en vez de duplicar en silencio) y flag de aviso de reciente al publicar. En este ticket la revisión de foto usa un fake de PhotoReview con las mismas decisiones (bloquear explícito, bloquear ornamental clara, dudar con aviso, permitir caño); el proveedor real llega en su ticket.

## Criterios de aceptación

- [ ] Sin presencia no se puede aportar (mensaje claro).
- [ ] Tope 5 aportes/día enforced por persona.
- [ ] Aportar junto a un pin existente muestra duplicado probable con alternativa de señalar/corregir.
- [ ] Lo publicado nace con aviso de reciente.
- [ ] Rama de revisión simulada verificada en tests (las 4 decisiones del fake).
- [ ] Correcciones de fuente usan el mismo flujo y reglas (no hay camino solo-admin).

## Bloqueado por

- ##2 — Seam `FuenteCatalog`.
- ##3 — Datos para el chequeo de duplicado.
- ##5 — PresenceGate real.
- ##4 — Cuentas (aportar exige cuenta).
