"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const CONSENT_KEY = "midline-cookie-consent";
export const CONSENT_EVENT = "midline-consent-accepted";

/**
 * Minimal cookie-consent banner. Analytics (Microsoft Clarity) loads only
 * after "Accept" — ClarityInit listens for CONSENT_EVENT / reads CONSENT_KEY.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  const decide = (value: "accepted" | "declined") => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    if (value === "accepted") window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-6 left-4 z-[80] w-[calc(100vw-2rem)] max-w-md border border-hairline bg-white p-5 text-ink motion-safe:animate-[toastIn_0.4s_cubic-bezier(0.22,1,0.36,1)_both] sm:left-6"
    >
      <p className="text-sm font-semibold">Cookies &amp; analytics</p>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-muted">
        We use Microsoft Clarity analytics to improve this site. It only runs if you accept. See our{" "}
        <Link href="/cookie-policy" className="font-semibold text-ibm-blue underline-offset-2 hover:text-ibm-blue-60 hover:underline">
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="inline-flex min-h-10 flex-1 items-center justify-center bg-ibm-blue px-4 text-sm font-normal text-white transition-colors hover:bg-ibm-blue-hover active:bg-ibm-blue-80"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("declined")}
          className="inline-flex min-h-10 flex-1 items-center justify-center bg-ink px-4 text-sm font-normal text-white transition-colors hover:bg-inverse-surface-1"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
