## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Cuentas de persona: alta/login con Apple, Google y email/contraseña, sesión persistente, y flag de admin en base de datos para operación del equipo (sin plan de pago). Descubrir fuentes sigue funcionando sin cuenta.

## Acceptance criteria

- [ ] Registro y login funcionan con Apple, Google y email/contraseña.
- [ ] La sesión persiste entre aperturas; cerrar sesión no rompe el descubrimiento.
- [ ] Flag admin asignable (a mano / panel mínimo) y verificable en un test.
- [ ] Sin paywall ni IAP en este ticket (la propina va en su propio ticket).
- [ ] Tests de Auth con proveedores simulados.

## Blocked by

- #{{T1}} — Fundación + seam `FuenteCatalog`.
