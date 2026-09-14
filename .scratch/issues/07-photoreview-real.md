## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

Cablear el PhotoReview real detrás de la misma interfaz del fake: paso 1 filtro de contenido explícito/seguro (bloquea desnudos/violencia/sexual con mensaje claro), paso 2 tipo de fuente (bloquea ornamental/no-fuente claras, aviso reforzado si duda, publica como reciente si parece caño de beber), EXIF GPS coincidente con el pin (~150 m) como señal de confianza (ni su falta ni el desajuste bloquean en duro), y difuminado de caras + guía de no fotografiar personas. Proveedor a elegir en el ticket.

## Acceptance criteria

- [ ] Foto explícita → bloqueada con mensaje claro (verificado con fixture).
- [ ] Ornamental clara → bloqueada; dudosa → publicada con aviso reforzado; caño claro → publicada como reciente.
- [ ] EXIF coincidente suma confianza; EXIF ausente/desajustado no bloquea.
- [ ] Caras difuminadas o guía visible de privacidad.
- [ ] El flujo de aporte pasa de fake a real sin cambiar su interfaz; tests de contrato del adapter real.
- [ ] Declaración explícita en el ticket: la IA no certifica potabilidad.

## Blocked by

- #{{T5A}} — Flujo de aporte (integración a re-verificar).
