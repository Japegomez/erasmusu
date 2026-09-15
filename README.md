# Erasmusu v1 — Roma (T2: import OSM + mapa/lista)

Utilidad para que un recién llegado encuentre agua potable cerca. v1 gratis, sin anuncios ni paywall (única transacción: aportación voluntaria “invita un caffè”). Ver `CONTEXT.md` y `spec-v1-roma.md`.

## Toolchain

- App: **Expo SDK 57 + React Native 0.86 + TypeScript** + `react-native-maps` (mapa/lista T2).
- Backend/API: **Node 22 + TypeScript** (`backend/`, http estándar; datastore en memoria con seed OSM Roma).
- Dominio: **`FuenteCatalog`** en `packages/domain` + `FountainImporter` multi-fuente (OSM potable-only + fixture Madrid).
- Tests: **Vitest**. CI: **GitHub Actions**.

## Clon fresco

```sh
npm install
npm run typecheck
npm run test --workspaces
```

Backend (siembra ~170+ pines potables OSM Roma):

```sh
npm run build --workspace=@erasmusu/backend
npm run start --workspace=@erasmusu/backend
# GET http://localhost:3000/health
# GET http://localhost:3000/fuentes/cercanas?lat=41.9028&lon=12.4964&ciudadId=roma
```

App:

```sh
npm install --workspace=@erasmusu/app
npx expo start --tunnel
```

Datos OSM: ODbL © OpenStreetMap contributors. Investigación de otras fuentes: `docs/research/fuentes-datos-import.md`.

## Seam `FuenteCatalog`

`cercanas · masCercana · detalle · importar · aportar · senalar ·
marcarAtributo/desmarcarAtributo · toggleFavorito/favoritosDe · snapshotSed`
con adapters `PresenceGate`, `PhotoReview`, `FountainImporter`
(`filtrarPotables`, `desdeMadridMunicipal`).
