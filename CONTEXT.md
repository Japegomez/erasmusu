# Erasmusu

Utilidad para que un recién llegado encuentre agua potable cerca. Erasmus es el canal de entrada, no el límite del producto. Comida y experiencias quedan fuera de v1. v1 es **gratis, sin anuncios ni paywall**; la única transacción posible es una aportación voluntaria opcional (“invita un caffè”).

## Language

**Recién llegado**:
Persona recién establecida en una ciudad, con presupuesto limitado y estancia temporal (intercambio, primeros meses fuera).
_Avoid_: Turista de un día, residente local permanente, “usuario Erasmus” como única etiqueta

**Fuente**:
Punto público de agua **potable** que se puede beber. Una ornamental no es una fuente aunque esté en el mismo monumento o plaza; si junto a ella hay un caño potable, solo ese caño cuenta.
_Avoid_: Fuente ornamental, monumento con agua, tienda de agua embotellada, grifo privado

**Ciudad soportada**:
Ciudad en la que el producto opera con cobertura útil de fuentes. **v1: solo Roma.** Barcelona, Madrid y Bilbao quedan para fases posteriores.
_Avoid_: Lanzar cuatro ciudades a la vez en v1, “cualquier ciudad del mundo” sin datos

**Atributo de fuente**:
Característica observable de una fuente, marcada con presencia (una marca por persona y fuente). Cada etiqueta lleva un **conteo** de personas distintas que la marcaron; en la ficha se muestran **solo las que tienen ≥1**, ordenadas de mayor a menor conteo, destacando las de conteo más alto. v1, lista cerrada (6): **accesible** (se llega y se usa en silla de ruedas / carrito), **caudal rápido** (llena una botella sin espera eterna), **en sombra** (sombra en horas de calor), **asientos cerca** (banco o muro para sentarse a pocos metros), **agua muy fría** (se percibe notablemente fría al beber) y **apta para perros** (pilozzo bajo o punto donde bebe un perro).
_Avoid_: Mostrar etiquetas con cero marcas, abrir más etiquetas en v1; “buen sabor” / “limpia” como etiqueta (eso lo cubre el estado operativo)

**Aporte** (también: propuesta):
Crear o corregir una **fuente** desde la app (pin + foto obligatoria), con cuenta y presencia. Máximo **5 aportes por persona y día**. No es un voto sobre una fuente ya existente.
_Avoid_: Curación manual fuera de la app como camino principal, aporte anónimo, aporte sin foto, llamar “aporte” a una señal

**Señal**:
Voto con presencia (~150 m) sobre una fuente **que ya existe**, en 2 taps y **sin foto obligatoria** (foto opcional): respaldo (“sigue ahí / es potable”) o problema (“no está” / “no es potable” / “seca”). Máximo **5 señales por persona y día**; una señal activa por persona y fuente. No crea una fuente nueva.
_Avoid_: Voto remoto, exigir foto para señalar, “like”, denuncia genérica sin tipo, confundir con aporte

**Fuente más cercana**:
La acción principal del producto: un gesto que lleva a la fuente potable alcanzable más próxima a la persona. Tras encontrarla, se muestra dónde está y se puede abrir en la app de mapas del sistema. Sin anuncios intercalados.
_Avoid_: Navegación turn-by-turn dentro de Erasmusu como éxito principal, interstitial antes del resultado

**Modo sed**:
Botón grande “tengo sed” que resuelve el job en un tap, con caché local de las ~20 fuentes más cercanas (texto + fotos comprimidas) para funcionar con poca o ninguna cobertura, más widget de iOS/Android (“fuente a 120 m →”). Sin routing ni “fuentes en mi camino” en v1.
_Avoid_: Mapa pesado como primer gesto, depender siempre de red, rutas con desvío en v1

**Aviso de reciente**:
Indicador visible en una fuente recién aportada que aún no tiene respaldo de la comunidad: se muestra, pero no se presenta como igual de fiable que una ya asentada.
_Avoid_: Ocultar lo nuevo hasta moderación manual

**Estado operativo**:
Situación de una fuente respecto a si da agua ahora: en servicio, seca / sin caudal, o incidencia temporal. Se alimenta del feed municipal cuando existe (p. ej. Madrid “en servicio”) y de señales con presencia cuando no. Incluye frescura (“confirmada hace X días”); los respaldos viejos caducan.
_Avoid_: Solo “existe / no existe”, estado sin fecha, mezclar “no es potable” con “temporalmente seca”

**Presencia**:
Estar a unos **150 m** de la fuente en el momento de señalar o aportar para que el gesto cuente.
_Avoid_: Confirmar o rechazar desde cualquier lugar del mundo

**Ocultación**:
Dejar de mostrar una fuente en “más cercana” y en el mapa cuando se cumple la regla de problemas con quórum y proporción (≥ 2/3), con barra más alta si la fuente es importada o asentada (asimetría).
_Avoid_: Borrado duro sin rastro, tumbar con votos remotos o cuentas nuevas como único empujón

**Favorito**:
Fuente guardada por una persona con **cuenta**, sin pago. En v1: lista simple (sin carpetas).
_Avoid_: Favoritos de pago, carpetas como requisito de v1

**Reconocimiento**:
Crédito visible y ligero por aportes y señales útiles (p. ej. contador); no cuenta actividad ligada a fuentes que acabaron ocultas. Sin ranking global agresivo en v1.
_Avoid_: Gamificación por volumen bruto, premiar boicots o basura, leaderboard global en v1

**Revisión de foto**:
Pipeline en dos pasos sobre cada foto aportada, para **todo el mundo**: (1) **filtro de contenido explícito/seguro** — bloquea desnudos, violencia o contenido sexual con mensaje claro; (2) **tipo de fuente** — bloquea ornamental/no-fuente claros, aviso reforzado si duda, publicación normal si parece caño de beber (sigue siendo reciente). La ubicación EXIF, si existe y coincide con el pin (~150 m), suma confianza; si falta o no coincide, no bloquea. No garantiza potabilidad. Pide evitar fotografiar personas; difumina caras si aparecen.
_Avoid_: “La IA garantiza que es potable”, revisión solo en backoffice, moderación humana de cada foto, usar el filtro explícito como único control

**Cuenta**:
Identidad para aportar, señalar, favoritos y reconocimiento. Alta con Apple, Google o email/contraseña. Buscar fuentes no exige cuenta. Sin paywall; la única transacción posible es la aportación voluntaria.
_Avoid_: Solo redes sociales, aporte anónimo, paywall de favoritos

**Duplicado probable**:
Aviso al aportar cerca de una fuente ya existente, ofreciendo señalar o corregir esa en lugar de crear otra.
_Avoid_: Crear siempre sin avisar, bloqueo rígido sin alternativa

**Aportación voluntaria**:
Botón “invita un caffè”: donación opcional y única que no desbloquea nada ni quita nada (no hay ads que quitar). Implementación según política de tiendas (IAP de propina o enlace externo donde lo permitan).
_Avoid_: Pase premium, paywall, “donar para desbloquear”, anuncios

**Admin**:
Cuenta de equipo con privilegios de operación (flag en base de datos; editable a mano o panel mínimo). No implica un plan de pago — no hay pase.
_Avoid_: “Premium” / pase de pago

**Erasmus**:
Canal de llegada y comunidad de referencia del producto, no la audiencia exclusiva.
_Avoid_: Usar “Erasmus” como sinónimo del usuario final
