## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

La matemática de confianza, como lógica pura del catálogo con tests: ocultación si y solo si ≥3 problemas de cuentas distintas Y problemas ≥ 2/3 de (problemas + respaldos), con ≥5 problemas exigidos en importadas/asentadas; quitar aviso de reciente con 2 respaldos ajenos distintos con presencia; marcar agregados de fuentes ocultas para que el reconocimiento las ignore.

## Acceptance criteria

- [ ] Oculta exactamente cuando se cumplen quórum + proporción (+ barra ≥5 en importada/asentada); ni antes ni con votos remotos/sin presencia.
- [ ] Una fuente con muchos respaldos no cae con 3 problemas (test del caso boicot).
- [ ] Reciente se gradúa con 2 respaldos ajenos con presencia (el autor no cuenta).
- [ ] Ocultar es blando: la fuente sale de nearest/mapa pero deja rastro (visible como oculta donde aplique).
- [ ] Tests exhaustivos de la asimetría; sin UI nueva obligatoria (la UI la consumen otros tickets).

## Blocked by

- #{{T6A}} — Señales y estado (datos para verificar las reglas).
