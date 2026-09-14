## Parent

- #1 — Spec: Erasmusu v1 (seam `FuenteCatalog`, Roma, gratis/sin paywall)

## What to build

El gesto principal online: botón “tengo sed” → fuente usable más cercana (excluye ocultas; prioriza en servicio con frescura) → ficha con estado operativo, “confirmada hace X días” y aviso de reciente cuando aplique → abrir en la app de mapas del sistema. Incluye ubicación real del dispositivo y PresenceGate real (~150 m). Funciona sin cuenta. (La sección de atributos de la ficha llega con su ticket; aquí la ficha la reserva o la omite.)

## Acceptance criteria

- [ ] Un tap lleva a la fuente usable más cercana según reglas de estado/ocultación, sin login.
- [ ] La ficha muestra estado operativo + frescura + aviso de reciente cuando aplique.
- [ ] “Abrir en mapas” abre Maps del sistema con el destino correcto.
- [ ] Sin anuncios intercalados en el gesto.
- [ ] Tests del catálogo: nearest ignora ocultas/secas según reglas; PresenceGate real verificado con ubicaciones simuladas.

## Blocked by

- #{{T2}} — Import OSM Roma (datos reales para el gesto).
