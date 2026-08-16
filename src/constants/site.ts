/**
 * Static, non-content site metadata for Portfolio v2 ("In Focus").
 * @see docs/02-identity-first.md
 * @see docs/04-visual-identity.md
 */

export const SITE = {
  name: "Mohd Alsaf",
  shortName: "Alsaf",
  wordmark: "Mohd Alsaf",
  wordmarkSuffix: "· In Focus",
  title: "Mohd Alsaf",
  titleTemplate: "%s · Mohd Alsaf",
  description:
    "Mohd Alsaf — turning ideas into working things, figured out in the open.",
  tagline: "Turning ideas into working things, figured out in the open.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://mohdalsaf.dev",
  locale: "en_US",
  author: {
    name: "Mohd Alsaf",
    role: "Builder · Computer Science Student",
    location: "Pune, India",
    coordinates: "18.52°N 73.86°E",
  },
  accessionPrefix: "MA",
  firstLight: "2025-08-01",
  version: "v2.0",
} as const;

/** Social / contact handles. */
export const HANDLES = {
  github: { label: "GitHub", href: "https://github.com/sayyedmohdalsaf06-afk" },
  linkedin: { label: "LinkedIn", href: "#" },
  email: { label: "Email", href: "#" },
  instagram: { label: "Instagram", href: "#" },
  phone: { label: "Phone", href: "#" },
} as const;

export type HandleKey = keyof typeof HANDLES;
