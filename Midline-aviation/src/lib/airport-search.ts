/**
 * Server-only suggest logic over the generated dataset (src/data/airports.gen.json).
 *
 * Mirrors the observed behavior of XO's suggest_airport endpoint:
 *  - metros are matched independently of airports (a short query can return a
 *    metro with few or no airports),
 *  - a matched metro pulls in its top member airports tagged match {t:"ma"}
 *    even when their own text doesn't match (that's how "london" surfaces
 *    Farnborough), and
 *  - text tiers decide INCLUSION only — ordering is always weight-desc, done
 *    by the client's groupAirports(). The weights are precomputed at build
 *    time, which is where all "private airports first" ranking lives.
 */

import dataset from "@/data/airports.gen.json";
import type { ApRecord, MaRecord, MatchInfo } from "@/lib/airports";

type GenAp = ApRecord & { search: string };
type GenMa = MaRecord & { search: string };

const AP_LIMIT = 25;
const MA_LIMIT = 3;
const METRO_MEMBERS_LIMIT = 10;
const POPULAR_METROS = 6;
const POPULAR_MEMBERS_PER_METRO = 2;

const allMa = (dataset as { ma: GenMa[] }).ma;
const allAp = (dataset as unknown as { ap: GenAp[] }).ap;

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const stripSearch = <T extends { search: string }>(record: T, match?: MatchInfo) => {
  const rest: Omit<T, "search"> & { search?: string; match?: MatchInfo } = { ...record };
  delete rest.search;
  if (match) rest.match = match;
  return rest;
};

/**
 * Word-prefix match: the query must start the text or start one of its words.
 * Plain substring matching is wrong for place names — it made "nice" match
 * Venice, "york" match nothing useful, and "london" pull in Londonderry as a
 * separate market. Anchoring at word boundaries keeps "new york" matching
 * "New York City" while rejecting mid-word coincidences.
 */
const matchesWordPrefix = (text: string, query: string) =>
  text.startsWith(query) || text.includes(` ${query}`) || text.includes(`-${query}`);

// The `search` blob is "code|icao|iata|name|city|country" (lowercased,
// diacritics stripped). Tiers gate inclusion only — never display order.
const matchAirport = (airport: GenAp, query: string): MatchInfo | null => {
  const segments = airport.search.split("|");
  const [code] = segments;
  const name = normalize(airport.name);
  const city = normalize(airport.city);
  const country = normalize(airport.country);

  if (segments.slice(0, 3).includes(query)) return { t: "code", v: airport.code };
  if (city === query) return { t: "city", v: airport.city };
  if (country === query) return { t: "country", v: airport.country };
  if (code.startsWith(query)) return { t: "code", v: airport.code };
  if (matchesWordPrefix(city, query)) return { t: "city", v: airport.city };
  if (matchesWordPrefix(name, query)) return { t: "name", v: airport.name };
  if (matchesWordPrefix(country, query)) return { t: "country", v: airport.country };
  return null;
};

const metroNameMatches = (metro: GenMa, query: string) =>
  metro.search.split("|").some((term) => matchesWordPrefix(term, query));

/** Exact name hits lead, then the heaviest market — never dataset order. */
const metroRank = (metro: GenMa, query: string) => {
  const terms = metro.search.split("|");
  if (terms.some((term) => term === query)) return 2;
  if (terms.some((term) => term.startsWith(query))) return 1;
  return 0;
};

export const searchAirports = (rawQuery: string): { ma: MaRecord[]; ap: ApRecord[] } => {
  const query = normalize(rawQuery);
  if (query.length < 2) return popularAirports();

  // Strongest market first, one header per city name, capped: a "london"
  // search should open with London alone — not a stack of same-named headers
  // from Ontario, Kentucky and Londonderry. Airports in those other Londons
  // still appear, just as plain rows the way XO returns them.
  const candidates = allMa.filter((metro) => metroNameMatches(metro, query));
  // Only the best match tier survives: an exact "london" keeps London and
  // discards Londonderry and East London, which merely contain the word. A
  // partial query like "lond" has no exact tier, so those reappear.
  const bestRank = candidates.reduce((best, metro) => Math.max(best, metroRank(metro, query)), 0);

  const seenNames = new Set<string>();
  const ma = candidates
    .filter((metro) => metroRank(metro, query) === bestRank)
    .sort((left, right) => right.weight - left.weight)
    .filter((metro) => {
      const name = normalize(metro.name);
      if (seenNames.has(name)) return false;
      seenNames.add(name);
      return true;
    })
    .slice(0, MA_LIMIT);
  const matchedMetroIds = new Set(ma.map((metro) => metro.metropolitan_area_id));

  // allAp is pre-sorted weight-desc, so the first hits are already the best.
  const ap: ApRecord[] = [];
  const usedCodes = new Set<string>();
  const memberCounts = new Map<string, number>();

  for (const airport of allAp) {
    const inMatchedMetro =
      airport.metropolitan_area_id !== undefined &&
      matchedMetroIds.has(airport.metropolitan_area_id);
    const textMatch = matchAirport(airport, query);

    let match: MatchInfo | null = textMatch;
    if (!match && inMatchedMetro) {
      const count = memberCounts.get(airport.metropolitan_area_id!) ?? 0;
      if (count >= METRO_MEMBERS_LIMIT) continue;
      memberCounts.set(airport.metropolitan_area_id!, count + 1);
      match = { t: "ma", v: airport.metropolitan_area_id! };
    }
    if (!match || usedCodes.has(airport.code)) continue;

    usedCodes.add(airport.code);
    ap.push(stripSearch(airport, match));
    if (ap.length >= AP_LIMIT) break;
  }

  // When nothing matched by market name — an airport-name or code query like
  // "teterboro" or "teb" — adopt the market of the best hit so the group still
  // renders its header. Skipped when a market already matched, otherwise a
  // "chicago" search grows a stray "Rockford" header off a member airport.
  if (ma.length === 0) {
    const lead = ap.find((airport) => airport.metropolitan_area_id);
    const metro = lead
      ? allMa.find((m) => m.metropolitan_area_id === lead.metropolitan_area_id)
      : undefined;
    if (metro) ma.push(metro);
  }

  return { ma: ma.map((metro) => stripSearch(metro)), ap };
};

/** The {geo:{}} popular list — top metros with a taste of their best fields. */
export const popularAirports = (): { ma: MaRecord[]; ap: ApRecord[] } => {
  const ma = allMa.slice(0, POPULAR_METROS);
  const ap: ApRecord[] = [];
  for (const metro of ma) {
    const members = allAp
      .filter((airport) => airport.metropolitan_area_id === metro.metropolitan_area_id)
      .slice(0, POPULAR_MEMBERS_PER_METRO)
      .map((airport) =>
        stripSearch(airport, { t: "ma", v: metro.metropolitan_area_id })
      );
    ap.push(...members);
  }
  return { ma: ma.map((metro) => stripSearch(metro)), ap };
};
