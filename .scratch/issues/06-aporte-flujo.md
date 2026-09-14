## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Flujo de aporte (crear/corregir fuente): pin + foto obligatoria, con cuenta y presencia (~150 m), tope 5/día, rama de duplicado probable (ofrece señalar o corregir la existente en vez de duplicar en silencio) y flag de aviso de reciente al publicar. En este ticket la revisión de foto usa un fake de PhotoReview con las mismas decisiones (bloquear explícito, bloquear ornamental clara, dudar con aviso, permitir caño); el proveedor real llega en su ticket.

## Acceptance criteria

- [ ] Sin presencia no se puede aportar (mensaje claro).
- [ ] Tope 5 aportes/día enforced por persona.
- [ ] Aportar junto a un pin existente muestra duplicado probable con alternativa de señalar/corregir.
- [ ] Lo publicado nace con aviso de reciente.
- [ ] Rama de revisión simulada verificada en tests (las 4 decisiones del fake).
- [ ] Correcciones de fuente usan el mismo flujo y reglas (no hay camino solo-admin).

## Blocked by

- #{{T1}} — Seam `FuenteCatalog`.
- #{{T2}} — Datos para el chequeo de duplicado.
- #{{T3A}} — PresenceGate real.
- #{{T4}} — Cuentas (aportar exige cuenta).
