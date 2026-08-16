import type { MDXComponents } from "mdx/types";

/**
 * Global MDX component map.
 *
 * This is the single place to override how MDX elements render across the
 * site (projects, writing, logs, books, experiments). For Phase 2 we keep the
 * defaults; typographic + custom components (callouts, code blocks, diagrams)
 * are layered in during Phase 5 (Content Systems).
 *
 * @see docs/13-content-architecture.md
 * @see docs/14-component-architecture.md
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
