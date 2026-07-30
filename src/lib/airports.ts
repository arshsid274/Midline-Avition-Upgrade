/**
 * Shared airport-suggest types + the grouping algorithm, ported verbatim from
 * VistaJet's booking widget (XO's suggest_airport client, deobfuscated from
 * their production bundle). Isomorphic: the API route shapes `{ma, ap}`
 * responses against these types and the client groups them into dropdown rows.
 */

export type MaRecord = {
  metropolitan_area_id: string;
  name: string;
  country_code: string;
  country: string;
  has_multiple_airports: boolean;
  weight: number;
  /** Display code of the airport an "Any airport" selection resolves to. */
  main_ap: string | null;
};

export type MatchInfo = {
  t: "code" | "name" | "city" | "country" | "ma";
  v: string;
};

export type ApRecord = {
  /** Display code, IATA-preferred (XO shows ICAO here; we favor IATA). */
  code: string;
  icao: string | null;
  iata: string | null;
  name: string;
  city: string;
  country_code: string | null;
  country: string;
  lat: number | null;
  lon: number | null;
  metropolitan_area_id?: string;
  weight: number;
  isPrivate: boolean;
  match?: MatchInfo;
};

export type SuggestResponse = {
  status: string;
  key: string;
  ma: MaRecord[];
  ap: ApRecord[];
};

/** One dropdown row — XO's discriminated union, their type names kept. */
export type SuggestionItem =
  | { type: "metropolitan-area-with-airports"; ma: MaRecord }
  | { type: "metropolitan-area"; ma: MaRecord }
  | { type: "airport-nested"; ap: ApRecord; ma_name: string }
  | { type: "airport"; ap: ApRecord };

export type AirportSelection =
  | { kind: "airport"; ap: ApRecord }
  | { kind: "metro"; ma: MaRecord };

const byWeightDesc = <T extends { weight: number }>(a: T, b: T) =>
  (b.weight || 0) - (a.weight || 0);

/**
 * XO's exact client grouping: sort airports by weight DESC, bucket them by
 * metropolitan_area_id (orphans → rest), then walk the metros in the order
 * the server returned them, emitting each metro header followed by its
 * weight-sorted members; orphan airports go flat at the bottom.
 */
export const groupAirports = (ma: MaRecord[], ap: ApRecord[]): SuggestionItem[] => {
  const buckets = new Map<string, SuggestionItem[]>();
  const rest: SuggestionItem[] = [];

  for (const airport of [...ap].sort(byWeightDesc)) {
    const metro = airport.metropolitan_area_id
      ? ma.find((m) => m.metropolitan_area_id === airport.metropolitan_area_id)
      : undefined;
    if (metro) {
      const bucket = buckets.get(metro.metropolitan_area_id) ?? [];
      bucket.push({ type: "airport-nested", ap: airport, ma_name: metro.name });
      buckets.set(metro.metropolitan_area_id, bucket);
    } else {
      rest.push({ type: "airport", ap: airport });
    }
  }

  const items: SuggestionItem[] = [];
  for (const metro of ma) {
    const bucket = buckets.get(metro.metropolitan_area_id);
    if (bucket) {
      items.push({ type: "metropolitan-area-with-airports", ma: metro });
      items.push(...bucket);
    } else {
      items.push({ type: "metropolitan-area", ma: metro });
    }
  }

  return [...items, ...rest];
};

/** Metro header — XO renders "London, GB (Any airport)"; we spell the country out. */
export const formatMetroLabel = (ma: MaRecord) => `${ma.name}, ${ma.country}`;

/** Airport row — XO's "{ma_name ?? city} {name} ({code})". */
export const formatAirportLabel = (ap: ApRecord, maName?: string) =>
  `${maName ?? ap.city} ${ap.name} (${ap.code})`;

/** The string written into the form input once something is picked. */
export const formatSelectionValue = (selection: AirportSelection) =>
  selection.kind === "metro"
    ? `${selection.ma.name}, ${selection.ma.country} (Any airport)`
    : `${selection.ap.city}, ${selection.ap.country} (${selection.ap.code})`;
