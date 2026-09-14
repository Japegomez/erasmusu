## Problem Statement

Un recién llegado en Roma tiene sed y no sabe qué puntos de agua son realmente potables (frente a ornamentales tipo Fontana di Trevi), cuáles siguen en servicio hoy, ni cómo llegar al más cercano sin depender de una app municipal genérica o de un mapa OSM que mezcla basura. Quiere un gesto inmediato (“tengo sed”), poder aportar y señalar con confianza (presencia, foto revisada), guardar favoritos, y hacerlo gratis, sin anuncios ni paywall.

## Solution

Erasmusu v1 es una app React Native (iOS + Android) centrada en **Roma**, con arquitectura preparada para **añadir otras ciudades más adelante** (p. ej. Barcelona, Madrid, Bilbao) sin reescribir el dominio. Incluye: import de fuentes potables, botón modo sed / fuente más cercana con caché offline y widget, ficha con estado operativo + frescura y atributos con conteo, aportes con foto y revisión (explícito + tipo + EXIF), señales en 2 taps, favoritos con cuenta, reconocimiento ligero, y aportación voluntaria “invita un caffè” que no desbloquea nada. El dominio se concentra detrás de una sola seam profunda: `FuenteCatalog`.

## User Stories

1. Como recién llegado sin cuenta, quiero abrir la app y pulsar “tengo sed”, para ver de inmediato la Fuente usable más cercana sin registrarme.
2. Como recién llegado, quiero que Fuente más cercana ignore Fuentes ocultas y priorice las en servicio con frescura reciente, para no ser enviado a un pin seco o poco fiable.
3. Como recién llegado, quiero ver la distancia y abrir la Fuente en la app de mapas del sistema, para ir andando sin navegación turn-by-turn dentro de Erasmusu.
4. Como recién llegado sin cobertura o con roaming malo, quiero que el modo sed use una caché local de ~20 Fuentes cercanas (con fotos comprimidas), para que la sed funcione igual sin red.
5. Como usuario del teléfono, quiero un widget en la pantalla de inicio con la distancia aproximada a una Fuente cercana, para actuar sin abrir la app completa.
6. Como recién llegado, quiero explorar un mapa o lista de Fuentes potables cercanas **en Roma** en v1, para mirar más allá del pin más cercano.
7. Como recién llegado, quiero una ficha de Fuente con estado operativo y “confirmada hace X días”, para saber si es probable que haya agua ahora.
8. Como recién llegado, quiero aviso de reciente en Fuentes recién aportadas, para tratarlas con la cautela adecuada.
9. Como recién llegado, quiero ver solo atributos de fuente con conteo ≥ 1, ordenados de mayor a menor y con los conteos altos destacados, para que el consenso de la comunidad sea obvio y no haya ruido de etiquetas vacías.
10. Como recién llegado, quiero entender (cuando existan) las etiquetas accesible, caudal rápido, en sombra, asientos cerca, agua muy fría y apta para perros, para elegir la Fuente que encaje con mi situación.
11. Como recién llegado, quiero la UI en ES, CA, EU, IT o EN, para usar el producto en el idioma preferido del conjunto v1.
12. Como recién llegado, quiero que los monumentos ornamentales no potables queden fuera del catálogo, para no ser enviado a decoraciones tipo Trevi en lugar de un caño de beber.
13. Como persona con cuenta, quiero crear un aporte (pin + foto obligatoria) estando en presencia (~150 m), para añadir una Fuente potable real donde estoy.
14. Como persona con cuenta, quiero un tope de 5 aportes al día, para limitar el spam sin curación manual.
15. Como persona que aporta, quiero que el paso 1 de revisión de foto bloquee contenido sexual/violento explícito con un mensaje claro, para mantener el catálogo seguro.
16. Como persona que aporta, quiero que el paso 2 bloquee imágenes claramente ornamentales/no-fuente, avise si hay duda, y permita fotos claras de caño de beber (sigue siendo reciente), para reducir errores tipo Trevi.
17. Como persona que aporta, quiero que el EXIF GPS que coincida con el pin (~150 m) sume confianza si existe, y que la falta o el desajuste de EXIF no bloqueen en duro, para que fotos sin metadatos de privacidad sigan funcionando.
18. Como persona que aporta, quiero que se difuminen caras y se pida evitar fotografiar personas, para respetar la privacidad.
19. Como persona que aporta cerca de un pin ya existente, quiero duplicado probable que ofrezca señalar o corregir la Fuente existente en lugar de crear otra en silencio, para mantener el mapa limpio.
20. Como persona con cuenta en presencia, quiero enviar una señal en dos taps sin foto obligatoria (foto opcional), para reportar rápido mientras camino.
21. Como persona que señala, quiero los tipos “sigue ahí / es potable”, “no está”, “no es potable” y “seca”, para distinguir potabilidad de estado operativo.
22. Como persona con cuenta, quiero tope de 5 señales al día y una señal activa por persona y Fuente, para limitar brigading y spam duplicado.
23. Como sistema, quiero ocultación cuando haya ≥3 problemas de cuentas distintas y problemas ≥ 2/3 de (problemas + respaldos), con barra más alta (≥5 problemas) en Fuentes importadas/asentadas, para que sea más caro tumbar agua buena que dudar de lo nuevo.
24. Como sistema, quiero quitar el aviso de reciente tras 2 respaldos ajenos distintos con presencia, para que la comunidad gradúe un aporte nuevo.
25. Como persona con cuenta en presencia, quiero marcar o desmarcar atributos de la lista cerrada de seis (una marca por persona, Fuente y atributo), para que los conteos reflejen personas distintas.
26. Como persona con cuenta, quiero guardar y listar Favoritos sin pago ni carpetas, para volver a Fuentes que ya conozco.
27. Como persona con cuenta, quiero Reconocimiento ligero (p. ej. contadores) que ignore actividad sobre Fuentes luego ocultas, para reconocer aportes útiles sin ranking global.
28. Como recién llegado, quiero registrarme con Apple, Google o email/contraseña, para poder aportar, señalar y guardar favoritos.
29. Como recién llegado, quiero descubrir (más cercana / mapa) sin cuenta, para que la sed nunca quede detrás de un login.
30. Como cualquier usuario, quiero “invita un caffè” como propina que no desbloquea nada, para apoyar el proyecto de forma opcional sin paywall.
31. Como Admin, quiero una cuenta con flag en base de datos para privilegios de operación, para que el equipo opere sin un plan “premium” de pago.
32. Como sistema, quiero que FountainImporter cargue datos OSM solo potables para Roma en el lanzamiento, diseñado multi-fuente para enchufar después feeds como Madrid “en servicio” u otras ciudades, para no reescribir el importador al crecer.
33. Como sistema, quiero estado operativo derivado de feeds municipales cuando existan y de señales cuando no, con caducidad de frescura en los respaldos, para que “en servicio” sea honesto.
34. Como recién llegado, quiero que Fuentes secas o problemáticas se deprioricen o excluyan del modo sed según las reglas de estado operativo, para que el gesto de un tap sea fiable.
35. Como persona que tenía en favoritos una Fuente que pasa a oculta, quiero un comportamiento claro (p. ej. visible en mis favoritos como oculta / no ofrecida como más cercana), para que favoritos y descubrimiento sean coherentes.
36. Como implementador React Native, quiero una sola seam profunda FuenteCatalog para el comportamiento del catálogo, para que UI, widget y tests compartan un contrato.
37. Como tester, quiero PresenceGate, PhotoReview y FountainImporter intercambiables detrás de FuenteCatalog, para probar reglas de confianza sin GPS/IA/OSM reales en cada caso.
38. Como revisor de tienda / usuario, quiero cero anuncios interstitial y cero IAP de desbloqueo, para alinear el producto con la decisión gratis/sin paywall.
39. Como recién llegado que vuelve a la app, quiero que la caché del modo sed se refresque en línea, para que el snapshot offline no se pudra sin oportunidad de actualizar.
40. Como persona que corrige una Fuente, quiero flujos de aporte-como-corrección (ubicación/foto/metadatos) bajo las mismas reglas de presencia y revisión, para que los arreglos sean de primera clase sin un camino solo-admin.
41. Como recién llegado que más adelante use la app en otra ciudad soportada, quiero el mismo gesto “tengo sed” y las mismas reglas de confianza, para no aprender un producto distinto por ciudad.
42. Como sistema, quiero modelar Ciudad soportada como concepto de primer nivel (v1 = solo Roma activa), para activar Barcelona, Madrid, Bilbao u otras sin rediseñar FuenteCatalog.

## Implementation Decisions

### Arquitectura y seams
- App React Native greenfield (iOS + Android), un solo codebase (ADR-0002).
- Seam principal: **`FuenteCatalog`** — módulo profundo que posee descubrimiento, detalle, aporte, señal, atributos, favoritos y snapshot de caché sed. UI, widgets y tests solo llaman a esta interfaz para el dominio de fuentes.
- Adapters internos (no seams de producto): **`PresenceGate`** (~150 m), **`PhotoReview`** (explícito + tipo + EXIF), **`FountainImporter`** (OSM solo potable; multi-fuente listo, Madrid “en servicio” como referencia de diseño — ADR-0012), **`Auth`** (Apple/Google/email + flag admin), **`TipJar`** (propina opcional, no desbloquea nada).
- Preferir una sola seam externa para el dominio de fuentes; no fragmentar en muchos servicios superficiales.

### Producto / dominio (glosario)
- **v1 centrada en Roma** (ADR-0011), con **posibilidad explícita de añadir otras ciudades en el futuro** (Barcelona, Madrid, Bilbao u otras) reutilizando FuenteCatalog + importador multi-fuente; no hace falta tipología nasone/fontanella/casa: todo punto potable es una **Fuente**.
- Gratis, sin ads, sin IAP de desbloqueo; solo **aportación** voluntaria “invita un caffè” (ADR-0010, ADR-0013). Implementar propina según política de tiendas (IAP tip y/o enlace externo permitido).
- Idiomas: ES, CA, EU, IT, EN (ADR-0004).
- Presencia ~150 m para aporte, señal y marcas de atributo (ADR-0001).
- Topes: 5 aportes/día, 5 señales/día; una señal activa por persona y Fuente (ADR-0001).
- Ocultación: ≥3 problemas distintos Y problemas ≥ 2/3 de (problemas + respaldos); importadas/asentadas además ≥5 problemas (ADR-0001).
- Aviso de reciente en aportes nuevos; se quita con 2 respaldos ajenos distintos con presencia (ADR-0001).
- Atributos: lista cerrada de 6 con conteos implícitos; mostrar solo conteo ≥ 1; orden desc; destacar conteos altos (CONTEXT).
- Tipos de señal incluyen “seca” como problema operativo distinto de “no es potable” cuando haga falta para estado operativo.
- Pipeline de foto: (1) bloquear contenido explícito, (2) filtro tipo fuente, EXIF de proximidad como señal de confianza no bloqueo duro; difuminar caras (ADR-0003, ADR-0013).
- Duplicado probable al aportar cerca de un pin existente (ADR-0008).
- Favoritos: requieren cuenta, gratis, lista plana, sin carpetas.
- Modo sed: CTA grande, caché ~20 cercanas, widgets iOS/Android; sin “fuentes en mi camino” con desvío (ADR-0013).
- Admin: solo flag en DB, no plan de pago.

### Partición lógica de módulos (no rutas de archivo)
- `FuenteCatalog` (orquestación de dominio + reglas de confianza).
- Adapters `PresenceGate`, `PhotoReview`, `FountainImporter`.
- `Auth` sesión + proveedores de identidad.
- `TipJar` propina de tienda.
- Shell RN: home (modo sed), mapa/lista, detalle, aporte, cuenta/favoritos, ajustes/idiomas, entrada de propina.
- Persistencia local para caché sed y sesión.
- API backend + almacén detrás de los adapters de FuenteCatalog (proveedor concreto aplazado a tickets de implementación; el contrato sigue centrado en el catálogo).
- Modelo de **Ciudad soportada** con Roma activa en v1 y extensión futura sin cambiar la interfaz de FuenteCatalog.

### API / esquema (conceptual)
- Fuente: id, ciudadId, ubicación, fotos, origen (importada|aportada), flag reciente, estado operativo + lastConfirmedAt, flag oculta, conteos de atributos, agregados de señales.
- Señal: persona, fuente, tipo, timestamp, verificada-con-presencia.
- Intento de aporte: persona, ubicación, refs de foto, resultados de revisión, resultado de duplicado.
- Favorito: persona ↔ fuente.
- Persona: identidades auth, flag admin, contadores diarios, contadores de reconocimiento.
- Ciudad: id, nombre, activaEnProducto, fuentes de import configuradas.

### Interacciones
- Más cercana / modo sed nunca exigen auth; aportar/señalar/favorito/atributos sí.
- Abrir Maps usa mapas del SO con coordenadas de destino.
- Widget y caché offline leen el mismo snapshot nearby que produce FuenteCatalog.

## Testing Decisions

- Los buenos tests afirman **comportamiento externo** a través de las seams `FuenteCatalog` (y Auth/TipJar): dada ubicación, señales, fotos, imports → resultado de nearest, ocultar/mostrar, reglas de atributos, topes, resultados de revisión. No afirmar SQL interno, árboles de componentes RN ni helpers privados.
- Preferir adapters fake/in-memory de PresenceGate, PhotoReview e Importer en tests unitarios/integración; un test de contrato fino por adapter real cuando se cablee.
- Escenarios prioritarios: import solo potable excluye ornamentales; graduación reciente + respaldos; ocultación quórum+ratio+asimetría; visibilidad de atributos (solo ≥1, orden, énfasis); aporte bloqueado sin presencia; señal sin foto con presencia ok; foto explícita bloqueada; rama de duplicado probable; nearest ignora ocultas/secas según reglas; caché sed offline; propina no cambia entitlements; descubrimiento sin login; catálogo acotado a ciudad activa (Roma) con gancho para más ciudades.
- Prior art: ninguno en el repo (greenfield). Los tests de la seam del catálogo serán la plantilla de tickets posteriores.
- Tests UI: pocos smokes (modo sed → detalle → abrir maps; aporte happy path mockeado). La matemática de confianza se queda en FuenteCatalog.

## Out of Scope

- Comida, experiencias/eventos low-cost, chat/social, perfiles públicos ricos, ranking global, contadores personales de impacto, prueba social por universidad.
- Turn-by-turn in-app y “fuentes en mi camino” con desvío de ruta.
- Ads, pase premium, carpetas de favoritos, features de pago.
- **Lanzar** Barcelona, Madrid, Bilbao u otras en v1 (sí queda en alcance el *diseño* para añadirlas después; no el go-live multi-ciudad).
- Distinguir nasone / fontanella / casa dell’acqua como tipos de producto.
- Competir con Acea/Acquea en datos oficiales de calidad de laboratorio como requisito v1.

## Further Notes

- Contexto competitivo: Roma tiene Acquea; la diferenciación es confianza (solo potable, señales con presencia, revisión de foto, frescura/estado), modo sed offline y GTM Erasmus/recién llegado — no “más pines OSM”. Ver `docs/research/competidores-fuentes-app-stores.md`.
- Vocabulario de dominio: `CONTEXT.md`. ADRs vinculantes: 0001–0008, 0010–0013 (0009 sustituido).
- Roma es el centro de v1; otras ciudades son evolución prevista, no promesa de fecha.
- Siguiente paso tras este spec: `/to-tickets` para partir en issues tracer-bullet con aristas de bloqueo, luego `/implement` por ticket con contexto fresco.
- TipJar: resolver política de donación/propina de App Store / Play en el primer ticket de pagos; la regla de producto sigue siendo “no desbloquea nada”.
