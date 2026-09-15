## Padre

- #1 — Especificación: Erasmusu v1 (costura `FuenteCatalog`, Roma, gratis/sin paywall)

## Qué construir

Señales de comunidad en 2 taps, sin foto obligatoria (foto opcional), con cuenta y presencia: tipos “sigue ahí / es potable”, “no está”, “no es potable”, “seca”. Topes (5/día, una activa por persona y fuente) y actualización de estado operativo + frescura (“confirmada hace X días”) con caducidad de respaldos viejos. (Las reglas de ocultar/graduar llegan en su ticket.)

## Criterios de aceptación

- [ ] Señalar son 2 taps, sin foto obligatoria, solo con presencia y cuenta.
- [ ] Topes enforced: 5/día y una activa por persona y fuente (cambiarla sustituye, no suma).
- [ ] Cada señal actualiza estado operativo y su fecha; “seca” es problema operativo distinto de “no es potable”.
- [ ] Respaldos viejos caducan (umbral fijado y testeado).
- [ ] Tests del catálogo para topes, tipos y frescura.

## Bloqueado por

- ##2 — Seam `FuenteCatalog`.
- ##3 — Fuentes sobre las que señalar.
- ##5 — PresenceGate real.
- ##4 — Cuentas (señalar exige cuenta).
