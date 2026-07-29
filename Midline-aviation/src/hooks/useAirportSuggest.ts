"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  groupAirports,
  type SuggestionItem,
  type SuggestResponse,
} from "@/lib/airports";

// Single-timer debounce, matching the pattern in VistaJet's widget.
const DEBOUNCE_MS = 250;

/**
 * Debounced client for /api/airports/suggest. Returns dropdown rows already
 * grouped by the XO algorithm (groupAirports). The popular list ({geo:{}})
 * fires immediately on demand; text queries debounce. A monotonic request
 * counter plus AbortController guarantees a stale response never overwrites
 * a newer one, and the server `key` is echoed back like XO's client does.
 */
export function useAirportSuggest() {
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const sessionKeyRef = useRef<string | null>(null);
  const popularRef = useRef<SuggestionItem[] | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
    },
    []
  );

  const request = useCallback(async (body: Record<string, unknown>, showEmpty: boolean) => {
    const seq = ++requestSeqRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const response = await fetch("/api/airports/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          sessionKeyRef.current ? { ...body, key: sessionKeyRef.current } : body
        ),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`suggest failed: ${response.status}`);

      const payload = (await response.json()) as SuggestResponse;
      if (seq !== requestSeqRef.current) return null;

      sessionKeyRef.current = payload.key ?? sessionKeyRef.current;
      const grouped = groupAirports(payload.ma ?? [], payload.ap ?? []);
      setItems(grouped);
      setIsEmpty(showEmpty && grouped.length === 0);
      setLoading(false);
      return grouped;
    } catch (error) {
      if (controller.signal.aborted) return null;
      console.error("Airport suggest request failed:", error);
      if (seq === requestSeqRef.current) {
        setItems([]);
        setIsEmpty(false);
        setLoading(false);
      }
      return null;
    }
  }, []);

  /** Immediate {geo:{}} fetch for the empty-input dropdown; cached per mount. */
  const loadPopular = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (popularRef.current) {
      requestSeqRef.current++;
      setItems(popularRef.current);
      setIsEmpty(false);
      setLoading(false);
      return;
    }
    void request({ geo: {} }, false).then((grouped) => {
      if (grouped) popularRef.current = grouped;
    });
  }, [request]);

  /** Debounced text search; falls back to the popular list under 2 chars. */
  const search = useCallback(
    (query: string) => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        loadPopular();
        return;
      }
      timerRef.current = window.setTimeout(() => {
        void request({ text: trimmed }, true);
      }, DEBOUNCE_MS);
    },
    [loadPopular, request]
  );

  return { items, loading, isEmpty, loadPopular, search };
}
