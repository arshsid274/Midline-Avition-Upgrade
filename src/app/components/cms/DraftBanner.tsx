import { draftMode } from "next/headers";

/**
 * Fixed strip shown whenever the visitor is in draft mode.
 *
 * The draft cookie is domain-wide and survives navigation, so without a
 * visible indicator and a way out, an editor who previewed once keeps seeing
 * unpublished content across the whole site and assumes it has gone live.
 */
export default async function DraftBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-[100] flex items-center justify-center gap-3 bg-navy px-4 py-2 text-xs text-offwhite"
    >
      <span>You are viewing unpublished draft content.</span>
      <a
        href="/exit-preview"
        className="border border-offwhite/60 px-2 py-1 font-medium uppercase tracking-wide transition-colors hover:bg-champagne hover:border-champagne hover:text-navy"
      >
        Exit preview
      </a>
    </div>
  );
}
