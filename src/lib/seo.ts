import type { Metadata } from "next";
import { SITE } from "@/constants";

/**
 * SEO metadata foundation. `buildMetadata` produces per-page Metadata objects
 * from a small set of overrides, applying the site defaults + title template.
 * Full JSON-LD + dynamic OG images land in Phase 7 (see docs/16).
 */

interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  /** Absolute or /public-relative OG image path. */
  image?: string;
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image = "/images/og/default.png",
  noindex = false,
}: BuildMetadataInput = {}): Metadata {
  const url = `${SITE.url}${path === "/" ? "" : path}`;
  const resolvedTitle = title ?? SITE.title;

  return {
    title: title ? { absolute: title } : SITE.title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: resolvedTitle,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: SITE.name }],
      locale: SITE.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [image],
    },
  };
}
