# Importador multi-fuente con Madrid como referencia

v1 lanza solo en Roma (ADR-0011), pero el importador se diseña multi-fuente desde el inicio: OSM potable + feed municipal con estado operativo, usando Madrid (“en servicio”, actualizado a diario) como diseño de referencia. Así Madrid puede entrar como segunda ciudad sin refactorizar, y Roma ya aprovecha el concepto de estado + frescura aunque su feed municipal sea más débil.
