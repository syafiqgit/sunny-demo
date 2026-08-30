/**
 * Link targets on this page (maps, live stream, gift, Instagram handles) all
 * arrive as props, so they are potentially author-supplied rather than
 * hard-coded. React escapes text but not URL schemes: a `javascript:` or
 * `data:` href in an <a> still runs. Everything is funnelled through here so
 * only real navigations survive.
 */
const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function safeHref(href: string | undefined | null): string | undefined {
  if (!href) return undefined;

  const trimmed = href.trim();
  // Fragments and site-relative paths never carry a scheme, so they are safe
  // as they stand and cannot be parsed without a base.
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return trimmed;

  try {
    const url = new URL(trimmed);
    return SAFE_PROTOCOLS.has(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** An Instagram profile URL for a handle, with the handle escaped. */
export function instagramUrl(handle: string): string {
  return `https://instagram.com/${encodeURIComponent(handle.replace(/^@/, ""))}`;
}
