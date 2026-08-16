import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Content loading foundation.
 *
 * Reads MDX collections from `/content`, parses frontmatter with gray-matter,
 * and validates each record against its Zod schema at build time. Malformed
 * content fails loudly (dev) or is skipped with a warning (prod) so the site
 * never renders broken data.
 *
 * Phase 2 provides the plumbing; individual sections wire specific collections
 * in Phase 3–5. All functions degrade gracefully to `[]` when a collection is
 * empty or absent (empty-state friendly — see docs/13 §6).
 *
 * These utilities are server-only (they touch the filesystem).
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface MdxDoc<T> {
  frontmatter: T;
  /** Raw MDX body (compiled by the MDX pipeline downstream). */
  body: string;
  slug: string;
}

function collectionDir(collection: string): string {
  return path.join(CONTENT_DIR, collection);
}

function readMdxFiles(collection: string): { file: string; raw: string }[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .filter((f) => !f.startsWith("_"))
    .map((file) => ({
      file,
      raw: fs.readFileSync(path.join(dir, file), "utf-8"),
    }));
}

/**
 * Load + validate an MDX collection.
 * @param collection folder name under /content (e.g. "projects")
 * @param schema Zod schema for the frontmatter
 */
export function getMdxCollection<S extends z.ZodTypeAny>(
  collection: string,
  schema: S,
): MdxDoc<z.infer<S>>[] {
  const docs: MdxDoc<z.infer<S>>[] = [];

  for (const { file, raw } of readMdxFiles(collection)) {
    const { data, content } = matter(raw);
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const msg = `[content] Invalid frontmatter in ${collection}/${file}: ${parsed.error.message}`;
      if (process.env.NODE_ENV === "production") {
        console.warn(msg);
        continue;
      }
      throw new Error(msg);
    }

    const fm = parsed.data as z.infer<S> & { slug?: string };
    docs.push({
      frontmatter: fm,
      body: content,
      slug: fm.slug ?? file.replace(/\.mdx?$/, ""),
    });
  }

  return docs;
}

/** Validate an in-memory data array (for TS/JSON collections in /content/data). */
export function validateData<S extends z.ZodTypeAny>(
  schema: S,
  items: unknown[],
  label: string,
): z.infer<S>[] {
  return items.map((item, i) => {
    const parsed = schema.safeParse(item);
    if (!parsed.success) {
      const msg = `[content] Invalid ${label}[${i}]: ${parsed.error.message}`;
      if (process.env.NODE_ENV === "production") {
        console.warn(msg);
      } else {
        throw new Error(msg);
      }
    }
    return (parsed.success ? parsed.data : item) as z.infer<S>;
  });
}
