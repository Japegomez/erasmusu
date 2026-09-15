# Erasmusu v1 — Roma (T1: fundación)

Utilidad para que un recién llegado encuentre agua potable cerca. v1 gratis, sin anuncios ni paywall (única transacción: aportación voluntaria “invita un caffè”). Ver `CONTEXT.md` y `spec-v1-roma.md`.

## Toolchain T1

- App: **Expo SDK 52 + React Native 0.76 + TypeScript** (un codebase iOS + Android, ADR-0002).
- Backend/API: **Node 22 + TypeScript** (`backend/`, http estándar; datastore en memoria en T1, Postgres planificado sin cambiar la seam).
- Dominio: **`FuenteCatalog`** en `packages/domain` (seam profunda única) + fakes en memoria (`PresenceGate` ~150 m, `PhotoReview`, `FountainImporter` potable-only).
- Tests: **Vitest** (contrato del catálogo con solo fakes). CI: **GitHub Actions** (build + tests en cada push).

## Clon fresco

```sh
npm install
# Clon fresco: hay que emitir dist/ de @erasmusu/domain antes del typecheck
# de backend/app (el script raíz ya lo hace; CI también).
npm run typecheck
npm run test --workspaces
```

Backend en local:

```sh
npm run build --workspace=@erasmusu/backend
npm run start --workspace=@erasmusu/backend
# GET http://localhost:3000/health
# GET http://localhost:3000/fuentes/cercanas?lat=41.9028&lon=12.4964&ciudadId=roma
```

App (Expo, un codebase iOS + Android):

```sh
npm install --workspace=@erasmusu/app
npx expo start --tunnel        # desarrollo
npx expo run:ios               # binario iOS (requiere macOS + Xcode)
npx expo run:android           # binario Android (requiere Android SDK)
```

Binarios de tienda vía EAS (`eas build -p ios|android`) — en CI Linux solo se
verifica typecheck del shell; la compilación nativa se hace en EAS/ runners
macOS en tickets de entrega.

## Seam `FuenteCatalog` (nombres T1)

`cercanas · masCercana · detalle · importar · aportar · senalar ·
marcarAtributo/desmarcarAtributo · toggleFavorito/favoritosDe · snapshotSed`
con adapters internos `PresenceGate`, `PhotoReview`, `FountainImporter`.
Contrato en `packages/domain/tests/catalog.contract.test.ts` (8 tests en verde).

Matemática completa de confianza (quórum + proporción + asimetría) y
PhotoReview real llegan en T6b/T5b sin cambiar esta interfaz.
