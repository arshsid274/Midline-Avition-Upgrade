import "server-only";

import { getPayload, type Payload } from "payload";

import config from "@/payload.config";

/**
 * Payload, or null if it cannot start.
 *
 * Every CMS mapper falls back to the committed content in src/lib/*-content.ts,
 * so the site can render completely without a database — that fallback exists
 * because Payload's drafts skip required-field validation and any field can
 * legitimately be missing. This extends the same tolerance one level up: if
 * Payload itself cannot initialise, the site still builds and serves correct
 * content rather than failing outright.
 *
 * That matters in two situations:
 *
 *   · A host with no environment variables set. Pages query the CMS during the
 *     build (generateStaticParams for /fleet/[slug], and every page mapper), so
 *     an unset PAYLOAD_SECRET otherwise fails the whole deployment and leaves
 *     nothing to look at.
 *   · The database being unreachable at build time. Once content lives in a
 *     hosted database, a transient outage would otherwise break a deploy that
 *     has nothing to do with the CMS.
 *
 * The failure is never silent: it logs once, loudly, naming the cause. What it
 * will not do is take the website down.
 */
let cached: Payload | null | undefined;
let warned = false;

export const tryGetPayload = async (): Promise<Payload | null> => {
  if (cached !== undefined) return cached;

  try {
    cached = await getPayload({ config });
  } catch (error) {
    cached = null;
    if (!warned) {
      warned = true;
      const reason = error instanceof Error ? error.message : String(error);
      console.error(
        [
          "",
          "  ⚠  Payload could not start — serving built-in content instead.",
          `     ${reason}`,
          "",
          "     The site will render correctly, but the CMS is inactive:",
          "       · /admin will not load",
          "       · edits will not appear",
          "",
          "     Check PAYLOAD_SECRET and DATABASE_URI in this host's",
          "     environment variables. A local .env file is not deployed.",
          "",
        ].join("\n")
      );
    }
  }

  return cached;
};
