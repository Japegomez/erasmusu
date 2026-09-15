# Fuentes de datos para import (T2 research)

**Fecha:** 2026-09-15  
**Contexto:** issue #3 — import OSM Roma + diseño multi-fuente.  
**Objetivo:** inventariar orígenes de los que se pueden extraer puntos potables (y estado operativo), más allá del Overpass de OpenStreetMap.

---

## Resumen

Para **v1 Roma**, la fuente abierta usable y alineada con la regla potable-only es **OpenStreetMap vía Overpass**. No hay dataset municipal de nasoni/fontanelle en el portal Open Data de Roma Capitale comparable al de Madrid/Barcelona. Acea/Acquea concentra el mapa oficial pero **sin API pública documentada**.

El importador multi-fuente (ADR-0012) queda listo con fixture **Madrid** (`OPERATIVO` / `EN SERVICIO` / `FUERA DE SERVICIO`). Barcelona y Bilbao son candidatos claros para fases posteriores.

---

## Roma (lanzamiento v1)

| Fuente | Tipo | ¿Extraíble? | Potable / estado | Notas |
|--------|------|-------------|------------------|-------|
| **OpenStreetMap (Overpass)** | Crowdsourced ODbL | **Sí** — usado en T2 | Filtrar `amenity=drinking_water` **o** `drinking_water=yes`; excluir `amenity=fountain` sin potabilidad (Trevi) | Tag `fountain=nasone` útil como metadata, no como filtro único. Snapshot en `packages/domain` |
| **Acea / Acquea (ex Waidy)** | App propietaria | **No** (API no pública) | Calidad / incidencias reclamadas en producto | Spec: no competir con laboratorio Acea como requisito v1 |
| **dati.comune.roma.it** | Open Data CKAN | **No encontrado** dataset fontanelle/nasoni (2026-09) | — | Catálogo revisado; hay GTFS y otros, no fuentes |
| **Geoportale Roma Capitale (WFS/WMS)** | OGC | **Dudoso** para fontanelle | — | Endpoint público existe; no hay layer obvio de fontanelle en catálogo superficial |
| **ReTerWiki / Open fontanelle** | Derivado OSM | Indirecto | Misma base OSM + case dell’acqua históricas | Útil como referencia; no sustituye Overpass |
| **AGAT / papers nasoni** | Investigación académica | Estático / no operativo | Coordenadas históricas (p. ej. Municipio V) | No feed vivo |

**Conclusión Roma:** OSM + filtro potable-only es la extracción correcta para v1. Acea queda como competencia UX, no como feed.

---

## Madrid (referencia de diseño multi-fuente, sin go-live)

| Fuente | Tipo | ¿Extraíble? | Estado operativo | Notas |
|--------|------|-------------|------------------|-------|
| **datos.madrid.es — Fuentes de agua para beber** | Open data diario (CSV/XLSX/…) | **Sí** | Portal habla de “en servicio” / fuera de servicio larga duración | [Dataset 300051-0-fuentes](https://datos.madrid.es/dataset/300051-0-fuentes) |
| **ArcGIS MapServer FUENTES_DE_AGUA** | REST Query | **Parcial** | Campo `ESTADO` = `OPERATIVO` (y análogos) | Layer id `3`; `CODIGO_INTERNO`, `USO`, etc. Geometry a veces `null` en consultas públicas → preferir CSV del portal o coords propias |
| **Madrid Móvil** | App oficial | No como API | Estado + ruta | Mismo origen municipal |
| **Canal de Isabel II (mapa Comunidad)** | Web mapa | No API clara | Cobertura autonómica (~4000) | Distinto del inventario Ayuntamiento |

Fixture T2: `MADRID_EN_SERVICIO_FIXTURE` acepta `OPERATIVO` y `EN SERVICIO` → `en-servicio`.

---

## Barcelona (futuro)

| Fuente | Tipo | ¿Extraíble? | Notas |
|--------|------|-------------|-------|
| **Open Data BCN — Fonts de beure** | CSV anual | **Sí** | [Dataset fonts](https://opendata-ajuntament.barcelona.cat/data/dataset/fonts); código de placa, dirección, coords |
| **Fonts ornamentals** | CSV | Separar | No mezclar con potables (mismo riesgo Trevi) |
| **Fonts BCN app** | Oficial | No API | Competidor local |

---

## Bilbao (futuro)

| Fuente | Tipo | ¿Extraíble? | Notas |
|--------|------|-------------|-------|
| **GeoBilbao** | Geoportal web | Por investigar layers | Sin app dedicada de fuentes |
| **OSM** | Overpass | Sí | Densidad menor; blanco competitivo |

---

## Otras fuentes globales (no prioritarias v1)

- **Wikidata / Wikimedia Commons** — fotos e ids; no catálogo operativo.
- **Panoramax / Mapillary** — fotos de calle; complemento de revisión, no pins.
- **Competidores OSM wrappers** (Water Finder, Watrify…) — no reutilizar sus dumps; licencia y frescura dudosas frente a Overpass directo.

---

## Recomendación de producto

1. **v1:** Overpass OSM Roma + filtro potable-only + re-import idempotente (hecho en T2).  
2. **Estado operativo Roma:** señales con presencia (tickets T6a); no hay feed municipal abierto comparable a Madrid.  
3. **Siguiente ciudad con feed fuerte:** Madrid municipal (estado diario) o Barcelona Open Data (inventario limpio).  
4. **No scrapear Acea/Acquea** sin acuerdo — riesgo legal/ToS y acoplamiento frágil.

---

## Enlaces

- [OSM amenity=drinking_water](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Ddrinking_water)
- [OSM Key:drinking_water](https://wiki.openstreetmap.org/wiki/Key:drinking_water)
- [OSM fountain=nasone](https://wiki.openstreetmap.org/wiki/Tag:fountain%3Dnasone)
- [Madrid dataset](https://datos.madrid.es/dataset/300051-0-fuentes)
- [Madrid MapServer](https://sigma.madrid.es/hosted/rest/services/MEDIO_AMBIENTE/FUENTES_DE_AGUA/MapServer)
- [Open Data BCN fonts](https://opendata-ajuntament.barcelona.cat/data/dataset?tags=Fonts)
- [Roma Open Data](https://dati.comune.roma.it/)
- ADR-0012, ADR-0011, `docs/research/competidores-fuentes-app-stores.md`
