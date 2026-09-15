import fs from "node:fs";

const raw = JSON.parse(
  fs.readFileSync("packages/domain/fixtures/roma-osm-raw.json", "utf8"),
);
const els = raw.elements.filter((e) => e.type === "node" && e.lat != null);
const lines = els.map((e) => {
  const tags = e.tags || {};
  return `  ${JSON.stringify(
    {
      idExterno: `osm-node-${e.id}`,
      lat: e.lat,
      lon: e.lon,
      ciudadId: "roma",
      tags,
    },
    null,
    2,
  ).replace(/^/gm, "  ").trimStart()}`;
});
const out = `/** Snapshot OSM Roma (ODbL © OpenStreetMap contributors). Generado en T2. */
import type { FuenteBruta } from "../adapters.js";

export const ROMA_OSM_RAW: FuenteBruta[] = [
${lines.join(",\n")}
];
`;
fs.writeFileSync("packages/domain/src/fixtures/romaOsmRaw.ts", out);
console.log("wrote", els.length);
