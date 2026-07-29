"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/**
 * Re-renders the page when the admin panel reports a change.
 *
 * Payload's admin posts a window message on every save/autosave; this asks
 * Next to refetch the route, which picks up the new draft because draft mode
 * bypasses the cache.
 *
 * Rendered only when draft mode is on, and imported dynamically, so the
 * published static page never requests this chunk.
 */
export default function LivePreviewListener() {
  const router = useRouter();

  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={
        process.env.NEXT_PUBLIC_SERVER_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000"
      }
    />
  );
}
