import "server-only";

/**
 * Resolve an upload relationship to a URL.
 *
 * With depth >= 1 Payload populates the related document, so the field is an
 * object carrying `url`. At depth 0 it is a bare ID and there is nothing to
 * resolve — callers fall back to their committed default.
 */
export const uploadUrl = (value: unknown): string | null => {
  if (!value || typeof value !== "object") return null;
  const url = (value as { url?: unknown }).url;
  return typeof url === "string" && url ? url : null;
};

export const uploadImage = (
  value: unknown,
  fallback: { src: string; alt: string }
): { src: string; alt: string } => {
  const url = uploadUrl(value);
  if (!url) return fallback;
  const alt = (value as { alt?: unknown }).alt;
  return { src: url, alt: typeof alt === "string" && alt ? alt : fallback.alt };
};
