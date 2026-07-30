/**
 * Build-time airport dataset generator — `npm run build:airports`.
 *
 * Replicates the architecture behind VistaJet's booking widget (XO's
 * suggest_airport API): every airport carries ONE precomputed charter-relevance
 * `weight` and an optional `metropolitan_area_id` foreign key into an explicit
 * metro table. The runtime never scores or does geometry — it just filters by
 * text and sorts by weight, exactly like XO's client.
 *
 * Inputs (committed sources, not publicly served):
 *   scripts/source-data/airports.json         OurAirports-format array
 *   scripts/source-data/privateairports.json  scraped private-charter directory
 *   scripts/source-data/cities15000.txt       GeoNames cities >= 15k population
 *   scripts/metro-seeds.json                  editorial ordering for top markets
 *
 * METRO AREAS are built globally, the way XO's server-side table works. Cities
 * claim airports, largest city first (pass 1); markets too small for the
 * population cut but built around a real business-aviation field — Aspen,
 * Courchevel, Olbia — are picked up afterwards (pass 2). Anchoring on cities
 * rather than airports matters: the reverse produced "Reading" for the London
 * cluster and "Chiba" for Tokyo, because the first high-scoring airport
 * claimed the region and named it after whatever town sat nearest. This also
 * replaces an earlier 16-entry hand-listed table that left Zurich, Tokyo,
 * Aspen and Dallas ungrouped entirely — and so dropped members like Narita
 * that do not text-match their own city.
 *
 * WEIGHT is multiplicative, not additive, because charter demand scales with
 * the market, not with airport attributes in isolation. The earlier additive
 * formula ranked empty French airstrips (700) above Geneva (440); XO's real
 * numbers are GVA 4005 vs LSGL 2. Shape:
 *
 *   weight = role x cityFactor^2 x countryFactor  (+ curated editorial pin)
 *
 *   role          dedicated business-aviation field in a metro   55
 *                 metro's primary commercial airport             45
 *                 secondary commercial airport in the metro      25
 *                 other field inside a metro                      8
 *                 outside any metro                               1-4
 *   cityFactor    log10(metro population) - 2, floored at 0.6
 *   countryFactor charter-activity tier (see COUNTRY_TIER)
 *
 * That reproduces XO's observed ordering: dedicated biz-av fields lead their
 * metro (TEB over JFK, PWK over ORD), the primary hub leads where there is no
 * such field (GVA, ZRH, HND), and remote strips collapse toward zero.
 * CURATED markets in metro-seeds.json override ordering outright.
 *
 * Output: src/data/airports.gen.json  { generatedAt, ma[], ap[] } — both
 * arrays pre-sorted weight-desc, each record carrying a normalized lowercase
 * `search` blob so the API route does zero per-request work.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = join(ROOT, "scripts", "source-data");
const OUTPUT_PATH = join(ROOT, "src", "data", "airports.gen.json");

/** Metro cluster radius — spans real metro areas (Heathrow–Stansted ~65 km). */
const METRO_RADIUS_KM = 70;
/** How far from a cluster anchor we look for the city that names the metro. */
const CITY_MATCH_KM = 55;
/** Below this population a cluster needs a business-aviation field to qualify. */
const METRO_MIN_POPULATION = 120000;

// Relative private-charter activity by country. Public, well-documented market
// structure: North America and Western Europe dominate business-aviation
// movements, the Gulf and Switzerland punch far above their population, and
// most of the world sees comparatively little charter traffic.
const COUNTRY_TIER = {
  US: 1, CA: 0.8, GB: 1, FR: 0.95, CH: 1, DE: 0.85, IT: 0.9, ES: 0.85,
  MC: 1, AT: 0.8, NL: 0.75, BE: 0.7, PT: 0.7, GR: 0.75, IE: 0.6, LU: 0.7,
  AE: 1, SA: 0.85, QA: 0.8, KW: 0.7, BH: 0.6, OM: 0.5, TR: 0.6, IL: 0.6,
  RU: 0.8, UA: 0.4, PL: 0.5, CZ: 0.55, SE: 0.55, NO: 0.55, DK: 0.55, FI: 0.45,
  SG: 0.85, HK: 0.8, JP: 0.6, CN: 0.55, KR: 0.5, IN: 0.6, TH: 0.5, MY: 0.5,
  ID: 0.45, PH: 0.4, VN: 0.35, AU: 0.65, NZ: 0.45,
  BR: 0.7, MX: 0.65, AR: 0.5, CL: 0.45, CO: 0.45, PE: 0.35, VE: 0.3,
  ZA: 0.5, EG: 0.45, MA: 0.45, NG: 0.45, KE: 0.4, AO: 0.35,
  BS: 0.8, KY: 0.8, BB: 0.6, BM: 0.7, TC: 0.7, AG: 0.6, VG: 0.7, AW: 0.6,
  MV: 0.7, MU: 0.5, SC: 0.5, CY: 0.6, MT: 0.6, IS: 0.5, HR: 0.6, ME: 0.6,
};
const DEFAULT_COUNTRY_TIER = 0.3;

const ROLE = {
  businessAviation: 55,
  primaryCommercial: 45,
  secondaryCommercial: 25,
  metroOther: 8,
  loneCommercial: 4,
  loneOther: 1,
};

// ---------------------------------------------------------------------------
// Country name handling: OurAirports uses ISO2, the private directory uses
// full names. Build a bidirectional map from Intl so both resolve uniformly.
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const codeToName = new Map();
const nameToCode = new Map();
for (let a = 65; a <= 90; a++) {
  for (let b = 65; b <= 90; b++) {
    const code = String.fromCharCode(a) + String.fromCharCode(b);
    let name;
    try {
      name = regionNames.of(code);
    } catch {
      continue;
    }
    if (!name || name === code) continue;
    codeToName.set(code, name);
    nameToCode.set(name.toLowerCase(), code);
  }
}
for (const [alias, code] of [
  ["united states of america", "US"],
  ["usa", "US"],
  ["uk", "GB"],
  ["united kingdom of great britain and northern ireland", "GB"],
  ["russia", "RU"],
  ["south korea", "KR"],
  ["north korea", "KP"],
  ["czech republic", "CZ"],
  ["turkey", "TR"],
  ["ivory coast", "CI"],
  ["cape verde", "CV"],
  ["democratic republic of the congo", "CD"],
  ["republic of the congo", "CG"],
  ["macedonia", "MK"],
  ["burma", "MM"],
]) {
  nameToCode.set(alias, code);
}

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const slugify = (value) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ---------------------------------------------------------------------------
// Parsing

const parseGeneralRecord = (item) => {
  if (!item || typeof item !== "object") return null;
  if (item.type === "closed") return null;

  const name = typeof item.name === "string" ? item.name : "";
  const city = (typeof item.municipality === "string" && item.municipality) || name;
  const countryCode =
    typeof item.country === "string" && /^[A-Za-z]{2}$/.test(item.country.trim())
      ? item.country.trim().toUpperCase()
      : null;
  const iata = typeof item.iata === "string" && item.iata ? item.iata.toUpperCase() : null;
  const icao = typeof item.icao === "string" && item.icao ? item.icao.toUpperCase() : null;
  const code = iata || icao;
  if (!name || !city || !countryCode || !code) return null;

  return {
    name,
    city,
    country_code: countryCode,
    country: codeToName.get(countryCode) ?? countryCode,
    code,
    iata,
    icao,
    lat: typeof item.lat === "number" ? item.lat : null,
    lon: typeof item.lon === "number" ? item.lon : null,
    type: typeof item.type === "string" ? item.type : null,
    scheduled_service:
      typeof item.scheduled_service === "boolean" ? item.scheduled_service : null,
    isPrivate: false,
    mergeKey: icao || code,
  };
};

// The scraped directory carries corrupted rows (e.g. LaGuardia split into
// name:"La" / city:"Guardia AirportNew York") — validate hard before trusting.
const parsePrivateRecord = (item) => {
  if (!item || typeof item !== "object") return null;

  const name = typeof item.name === "string" ? item.name.trim() : "";
  const city = (typeof item.city === "string" && item.city.trim()) || name;
  const code = typeof item.code === "string" ? item.code.trim().toUpperCase() : "";
  const countryRaw = typeof item.country === "string" ? item.country.trim() : "";

  if (name.length < 4) return null;
  if (/Airport[A-Z]/.test(city) || /Airport[A-Z]/.test(name)) return null;
  if (!/^[A-Z0-9]{3,4}$/.test(code)) return null;
  if (!countryRaw) return null;

  const countryCode = nameToCode.get(normalize(countryRaw)) ?? null;

  return {
    name,
    city,
    country_code: countryCode,
    country: countryCode ? codeToName.get(countryCode) ?? countryRaw : countryRaw,
    code,
    iata: null,
    icao: code.length === 4 ? code : null,
    lat: null,
    lon: null,
    type: null,
    scheduled_service: null,
    isPrivate: true,
    mergeKey: code,
  };
};

const mergeSources = (general, priv) => {
  const merged = new Map();
  for (const airport of general) merged.set(airport.mergeKey, airport);
  for (const airport of priv) {
    const existing = merged.get(airport.mergeKey);
    merged.set(airport.mergeKey, existing ? { ...existing, isPrivate: true } : airport);
  }
  return Array.from(merged.values());
};

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

/** 1-degree lat/lon bucket index — keeps the clustering passes near-linear. */
const buildGrid = (records) => {
  const grid = new Map();
  for (const record of records) {
    if (typeof record.lat !== "number" || typeof record.lon !== "number") continue;
    const key = `${Math.floor(record.lat)}:${Math.floor(record.lon)}`;
    const cell = grid.get(key);
    if (cell) cell.push(record);
    else grid.set(key, [record]);
  }
  return grid;
};

const gridNeighbors = (grid, lat, lon, spanDeg = 1) => {
  const out = [];
  const baseLat = Math.floor(lat);
  const baseLon = Math.floor(lon);
  for (let dLat = -spanDeg; dLat <= spanDeg; dLat++) {
    for (let dLon = -spanDeg; dLon <= spanDeg; dLon++) {
      const cell = grid.get(`${baseLat + dLat}:${baseLon + dLon}`);
      if (cell) out.push(...cell);
    }
  }
  return out;
};

// ---------------------------------------------------------------------------
// Load sources

const generalRaw = JSON.parse(readFileSync(join(SOURCE_DIR, "airports.json"), "utf8"));
const privateRaw = JSON.parse(readFileSync(join(SOURCE_DIR, "privateairports.json"), "utf8"));
const seedFile = JSON.parse(readFileSync(join(ROOT, "scripts", "metro-seeds.json"), "utf8"));

const general = (Array.isArray(generalRaw) ? generalRaw : Object.values(generalRaw))
  .map(parseGeneralRecord)
  .filter(Boolean);
const priv = (privateRaw.airports ?? []).map(parsePrivateRecord).filter(Boolean);
const merged = mergeSources(general, priv);

// GeoNames cities15000.txt: tab-separated, name at 1, lat 4, lon 5,
// country 8, population 14.
const cities = [];
for (const line of readFileSync(join(SOURCE_DIR, "cities15000.txt"), "utf8").split("\n")) {
  if (!line) continue;
  const f = line.split("\t");
  const population = Number(f[14]);
  if (!Number.isFinite(population)) continue;
  cities.push({
    name: f[1],
    lat: Number(f[4]),
    lon: Number(f[5]),
    country_code: f[8],
    population,
  });
}
const cityGrid = buildGrid(cities);

// ---------------------------------------------------------------------------
// Airport classification helpers

const isBusinessAviationField = (a) =>
  (a.isPrivate || a.scheduled_service === false) &&
  a.type !== "large_airport" &&
  a.type !== "heliport" &&
  a.type !== "seaplane_base" &&
  a.type !== "balloonport";

const isCommercial = (a) => a.scheduled_service === true && Boolean(a.iata);

// Anchor preference: the field most likely to define a market.
const anchorScore = (a) => {
  let score = 0;
  if (a.type === "large_airport") score += 100;
  else if (a.type === "medium_airport") score += 60;
  else if (a.type === "small_airport") score += 20;
  if (isCommercial(a)) score += 40;
  if (a.iata) score += 15;
  if (a.isPrivate) score += 10;
  return score;
};

// Keep the fields a charter operation can actually use. Inside a metro we also
// keep business-aviation strips (Melun, Pontoise) that would otherwise be cut.
const keepStandalone = (a) => {
  switch (a.type) {
    case "large_airport":
    case "medium_airport":
      return true;
    case "small_airport":
      return Boolean(a.iata) || a.scheduled_service === true || a.isPrivate;
    case "heliport":
    case "seaplane_base":
    case "balloonport":
      return Boolean(a.iata);
    default:
      return Boolean(a.iata) || a.isPrivate;
  }
};

// ---------------------------------------------------------------------------
// Metro construction.
//
// Metros are anchored on CITIES, not airports: a metropolitan area is defined
// by the city it serves, so the biggest city claims the airports around it.
// Anchoring on airports instead (an earlier attempt) produced "Reading" for
// the London cluster and "Chiba" for Tokyo, because the first high-scoring
// airport grabbed the region and named it after whatever town sat nearest.
// Largest city first also means Tokyo claims Narita before Chiba can.

const located = merged.filter((a) => typeof a.lat === "number" && typeof a.lon === "number");
const airportGrid = buildGrid(located);
const assigned = new Map(); // mergeKey -> metro id

const seedByKey = new Map();
for (const seed of seedFile.metros) {
  for (const code of seed.curated) seedByKey.set(code, seed);
}

const clusters = [];
const usedIds = new Set();

const claimAirportsAround = (lat, lon) => {
  const members = [];
  for (const candidate of gridNeighbors(airportGrid, lat, lon)) {
    if (assigned.has(candidate.mergeKey)) continue;
    if (haversineKm(lat, lon, candidate.lat, candidate.lon) > METRO_RADIUS_KM) continue;
    members.push(candidate);
  }
  return members;
};

const registerCluster = ({ name, countryCode, population, members, lat, lon }) => {
  const id = slugify(`${name}-${countryCode ?? "xx"}`);
  if (!id || usedIds.has(id)) return null;
  usedIds.add(id);
  for (const member of members) assigned.set(member.mergeKey, id);
  const cluster = { id, name, country_code: countryCode, population, members, lat, lon };
  clusters.push(cluster);
  return cluster;
};

// Pass 1 — real cities, largest first.
for (const city of [...cities].sort((l, r) => r.population - l.population)) {
  if (city.population < METRO_MIN_POPULATION) break;
  const members = claimAirportsAround(city.lat, city.lon);
  if (members.length === 0) continue;
  registerCluster({
    name: city.name,
    countryCode: city.country_code,
    population: city.population,
    members,
    lat: city.lat,
    lon: city.lon,
  });
}

// Pass 2 — charter markets too small for the population cut but built around a
// real business-aviation or commercial field (Aspen, Courchevel, Olbia, Ibiza).
for (const anchor of [...located].sort((l, r) => anchorScore(r) - anchorScore(l))) {
  if (assigned.has(anchor.mergeKey)) continue;
  const notable =
    Boolean(anchor.iata) &&
    (isBusinessAviationField(anchor) || isCommercial(anchor) || anchor.type === "medium_airport");
  if (!notable && !seedByKey.has(anchor.code)) continue;

  const members = claimAirportsAround(anchor.lat, anchor.lon);
  if (members.length === 0) continue;

  let city = null;
  for (const candidate of gridNeighbors(cityGrid, anchor.lat, anchor.lon)) {
    if (haversineKm(anchor.lat, anchor.lon, candidate.lat, candidate.lon) > CITY_MATCH_KM) continue;
    if (!city || candidate.population > city.population) city = candidate;
  }

  registerCluster({
    name: city?.name ?? anchor.city,
    countryCode: anchor.country_code ?? city?.country_code ?? null,
    population: city?.population ?? 0,
    members,
    lat: city?.lat ?? anchor.lat,
    lon: city?.lon ?? anchor.lon,
  });
}

const clusterById = new Map(clusters.map((c) => [c.id, c]));

// Curated seeds are matched to the cluster their first resolvable code landed
// in, so editorial ordering applies to the algorithmically-built metro.
const byCode = new Map();
for (const a of merged) {
  byCode.set(a.code, a);
  if (a.icao) byCode.set(a.icao, a);
}
const curatedByClusterId = new Map();
const unresolvedCodes = [];
for (const seed of seedFile.metros) {
  for (const code of seed.curated) {
    if (!byCode.has(code)) unresolvedCodes.push(`${seed.id}:${code}`);
  }
  // Bind the seed to the first curated code that actually landed in a metro —
  // not merely the first that exists. Cairo's leading field (Sphinx) sits
  // outside every cluster, which silently dropped the whole market.
  const anchorAirport = seed.curated
    .map((code) => byCode.get(code))
    .find((airport) => airport && assigned.has(airport.mergeKey));
  const clusterId = anchorAirport ? assigned.get(anchorAirport.mergeKey) : null;
  if (!clusterId) {
    console.warn(`seed ${seed.id}: no curated code landed in a metro cluster`);
    continue;
  }
  curatedByClusterId.set(clusterId, seed);
  // Editorial members that fell outside the radius still join their market.
  for (const code of seed.curated) {
    const airport = byCode.get(code);
    if (airport) assigned.set(airport.mergeKey, clusterId);
  }
  const cluster = clusterById.get(clusterId);
  if (cluster) {
    cluster.name = seed.name;
    cluster.country_code = seed.country_code;
    cluster.aliases = seed.aliases ?? [];
  }
}

// ---------------------------------------------------------------------------
// Weights

// Primary commercial airport per metro: the busiest-looking scheduled field,
// ties broken by proximity to the city. Without the distance tiebreak Tokyo
// picked Narita (60 km out) over Haneda (15 km) — both score identically on
// attributes alone, so iteration order decided it.
const clusterCenter = new Map(
  clusters.map((cluster) => [cluster.id, { lat: cluster.lat, lon: cluster.lon }])
);

const distanceToCenter = (airport, clusterId) => {
  const center = clusterCenter.get(clusterId);
  if (!center || typeof airport.lat !== "number") return Infinity;
  return haversineKm(airport.lat, airport.lon, center.lat, center.lon);
};

const primaryByCluster = new Map();
for (const airport of merged) {
  const clusterId = assigned.get(airport.mergeKey);
  if (!clusterId || !isCommercial(airport)) continue;
  const current = primaryByCluster.get(clusterId);
  if (!current) {
    primaryByCluster.set(clusterId, airport);
    continue;
  }
  const delta = anchorScore(airport) - anchorScore(current);
  const closer =
    delta > 0 ||
    (delta === 0 &&
      distanceToCenter(airport, clusterId) < distanceToCenter(current, clusterId));
  if (closer) primaryByCluster.set(clusterId, airport);
}

const roleOf = (airport, clusterId) => {
  if (!clusterId) return isCommercial(airport) ? ROLE.loneCommercial : ROLE.loneOther;
  if (isBusinessAviationField(airport)) return ROLE.businessAviation;
  if (primaryByCluster.get(clusterId) === airport) return ROLE.primaryCommercial;
  if (isCommercial(airport)) return ROLE.secondaryCommercial;
  return ROLE.metroOther;
};

// Resort and leisure markets — Aspen, Courchevel, St Moritz — drive real
// charter demand out of tiny populations, and GeoNames omits towns under
// 15k entirely, so their clusters would otherwise score near zero. A market
// built around a dedicated business-aviation field is credited with a floor
// population rather than its literal headcount.
const RESORT_FLOOR_POPULATION = 60000;

const effectivePopulation = (cluster) => {
  if (!cluster) return 0;
  const hasBizAvField = cluster.members.some(
    (member) => isBusinessAviationField(member) && (member.iata || member.isPrivate)
  );
  return hasBizAvField
    ? Math.max(cluster.population, RESORT_FLOOR_POPULATION)
    : cluster.population;
};

const cityFactorOf = (clusterId) => {
  const cluster = clusterId ? clusterById.get(clusterId) : null;
  return Math.max(0.6, Math.log10(Math.max(effectivePopulation(cluster), 1000)) - 2);
};

const weightOf = (airport) => {
  const clusterId = assigned.get(airport.mergeKey) ?? null;
  const countryFactor = COUNTRY_TIER[airport.country_code] ?? DEFAULT_COUNTRY_TIER;
  const cityFactor = cityFactorOf(clusterId);
  let weight = Math.round(roleOf(airport, clusterId) * cityFactor ** 2 * countryFactor);

  // Editorial pin: curated markets render in exactly the listed order, above
  // everything the algorithm ranked in that metro.
  const seed = clusterId ? curatedByClusterId.get(clusterId) : null;
  if (seed) {
    const index = seed.curated.indexOf(airport.code);
    if (index >= 0) weight += 100000 - 1000 * index;
  }
  return Math.max(weight, 1);
};

// Metro membership alone is not a licence to appear: without this, every farm
// strip within 70 km of a city entered the dataset. Members must still be a
// field a charter customer could use.
const kept = merged.filter(
  (a) =>
    keepStandalone(a) ||
    (assigned.has(a.mergeKey) && isBusinessAviationField(a) && (a.iata || a.isPrivate))
);

const ap = kept.map((airport) => {
  const clusterId = assigned.get(airport.mergeKey) ?? null;
  return {
    code: airport.code,
    icao: airport.icao,
    iata: airport.iata,
    name: airport.name,
    city: airport.city,
    country_code: airport.country_code,
    country: airport.country,
    lat: airport.lat,
    lon: airport.lon,
    ...(clusterId ? { metropolitan_area_id: clusterId } : {}),
    weight: weightOf(airport),
    isPrivate: airport.isPrivate,
    search: normalize(
      [airport.code, airport.icao, airport.iata, airport.name, airport.city, airport.country]
        .filter(Boolean)
        .join("|")
    ),
  };
});
ap.sort((a, b) => b.weight - a.weight);

const memberCounts = new Map();
const memberMaxWeight = new Map();
for (const airport of ap) {
  if (!airport.metropolitan_area_id) continue;
  const id = airport.metropolitan_area_id;
  memberCounts.set(id, (memberCounts.get(id) ?? 0) + 1);
  memberMaxWeight.set(id, Math.max(memberMaxWeight.get(id) ?? 0, airport.weight));
}

const ma = clusters
  .filter((cluster) => (memberCounts.get(cluster.id) ?? 0) > 0)
  .map((cluster) => ({
    metropolitan_area_id: cluster.id,
    name: cluster.name,
    country_code: cluster.country_code,
    country: codeToName.get(cluster.country_code) ?? cluster.country_code ?? "",
    has_multiple_airports: (memberCounts.get(cluster.id) ?? 0) > 1,
    weight: memberMaxWeight.get(cluster.id) ?? 0,
    main_ap:
      curatedByClusterId.get(cluster.id)?.curated.map((c) => byCode.get(c)?.code).find(Boolean) ??
      primaryByCluster.get(cluster.id)?.code ??
      ap.find((a) => a.metropolitan_area_id === cluster.id)?.code ??
      null,
    search: normalize([cluster.name, ...(cluster.aliases ?? [])].join("|")),
  }))
  .sort((a, b) => b.weight - a.weight);

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), ma, ap }));

if (unresolvedCodes.length > 0) {
  console.warn(`unresolved curated codes (ignored): ${unresolvedCodes.join(", ")}`);
}

const kb = Math.round(Buffer.byteLength(JSON.stringify({ ma, ap })) / 1024);
console.log(`wrote ${OUTPUT_PATH}: ${ma.length} metros, ${ap.length} airports (~${kb} KB)`);
for (const probe of ["TEB", "JFK", "LTN", "LHR", "GVA", "LSGL", "ZRH", "HND", "NRT", "ASE", "MDW", "ORD"]) {
  const hit = ap.find((a) => a.code === probe);
  console.log(`  ${probe}: weight=${hit?.weight ?? "MISSING"} metro=${hit?.metropolitan_area_id ?? "-"}`);
}
