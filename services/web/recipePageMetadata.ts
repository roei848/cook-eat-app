/**
 * Deterministic metadata read straight from a recipe page's HTML — the facts
 * a language model reads unreliably or not at all (URL-context tools see the
 * rendered text, not <meta> tags): the recipe photo, the credited author, and
 * the schema.org Recipe JSON-LD that most recipe sites publish.
 *
 * Pure string parsing on purpose — no DOM or URL APIs, so it behaves the same
 * under Hermes and in a plain Node test script.
 */

export interface RecipePageMetadata {
  /** Absolute URL of the recipe photo (JSON-LD Recipe.image, else og:image / twitter:image). */
  imageUrl?: string;
  /** Person or site credited as the author (JSON-LD Recipe.author, else <meta name="author">). */
  author?: string;
  /** The schema.org Recipe node when the page publishes one — handed to the model as grounding. */
  recipeJsonLd?: Record<string, unknown>;
}

const FETCH_TIMEOUT_MS = 8000;

// Some recipe sites serve a stripped page, or a 403, to non-browser agents
const BROWSER_HEADERS = {
  Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
};

/** Never throws — a page we cannot read simply yields no metadata. */
export async function fetchRecipePageMetadata(url: string): Promise<RecipePageMetadata> {
  try {
    const html = await fetchHtml(url);
    return extractRecipePageMetadata(html, url);
  } catch {
    return {};
  }
}

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Pure — exported so it can be exercised against saved HTML without a network. */
export function extractRecipePageMetadata(
  html: string,
  pageUrl: string
): RecipePageMetadata {
  const recipeJsonLd = findRecipeJsonLd(html);
  const metas = parseMetaTags(html);

  const imageUrl =
    toAbsoluteHttpUrl(firstImageUrl(recipeJsonLd?.image), pageUrl) ??
    toAbsoluteHttpUrl(
      metas.get("og:image") ?? metas.get("og:image:url") ?? metas.get("twitter:image"),
      pageUrl
    );

  const author = authorName(recipeJsonLd?.author) ?? cleanText(metas.get("author"));

  const result: RecipePageMetadata = {};
  if (imageUrl) result.imageUrl = imageUrl;
  if (author) result.author = author;
  if (recipeJsonLd) result.recipeJsonLd = recipeJsonLd;
  return result;
}

// ---------------------------------------------------------------------------
// <meta> tags
// ---------------------------------------------------------------------------

const META_TAG_RE = /<meta\b[^>]*>/gi;
const ATTR_RE = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

/** property/name → content. Keys lower-cased, entities decoded, first occurrence wins. */
function parseMetaTags(html: string): Map<string, string> {
  const metas = new Map<string, string>();
  for (const tag of html.match(META_TAG_RE) ?? []) {
    const attrs: Record<string, string> = {};
    for (const match of tag.matchAll(ATTR_RE)) {
      attrs[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
    }
    const key = (attrs.property ?? attrs.name)?.toLowerCase();
    const content = attrs.content?.trim();
    if (key && content && !metas.has(key)) metas.set(key, content);
  }
  return metas;
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

const JSON_LD_RE =
  /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function findRecipeJsonLd(html: string): Record<string, unknown> | undefined {
  for (const match of html.matchAll(JSON_LD_RE)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(stripCdata(match[1]));
    } catch {
      continue; // malformed block — other blocks on the page may still be fine
    }
    const recipe = findNodeOfType(parsed, "recipe");
    if (recipe) return recipe;
  }
  return undefined;
}

/** Handles both `<![CDATA[ … ]]>` and the XHTML-era `//<![CDATA[ … //]]>` wrapping. */
function stripCdata(text: string): string {
  return text
    .replace(/^\s*(?:\/\/)?\s*<!\[CDATA\[/, "")
    .replace(/(?:\/\/)?\s*\]\]>\s*$/, "")
    .trim();
}

/** Depth-limited walk: Recipe nodes hide under @graph, mainEntity, or plain arrays. */
function findNodeOfType(
  node: unknown,
  lowerType: string,
  depth = 0
): Record<string, unknown> | undefined {
  if (depth > 6 || node == null || typeof node !== "object") return undefined;

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findNodeOfType(item, lowerType, depth + 1);
      if (found) return found;
    }
    return undefined;
  }

  const record = node as Record<string, unknown>;
  const declared = record["@type"];
  const types = Array.isArray(declared) ? declared : [declared];
  // "@type" may be "Recipe" or a full "https://schema.org/Recipe" IRI
  if (
    types.some(
      (t) => typeof t === "string" && t.split("/").pop()?.toLowerCase() === lowerType
    )
  ) {
    return record;
  }

  for (const value of Object.values(record)) {
    const found = findNodeOfType(value, lowerType, depth + 1);
    if (found) return found;
  }
  return undefined;
}

/** schema.org image: string | ImageObject | array of either. */
function firstImageUrl(image: unknown): string | undefined {
  if (typeof image === "string") return image;
  if (Array.isArray(image)) {
    for (const item of image) {
      const url = firstImageUrl(item);
      if (url) return url;
    }
    return undefined;
  }
  if (image && typeof image === "object") {
    const record = image as Record<string, unknown>;
    return firstImageUrl(record.url ?? record.contentUrl);
  }
  return undefined;
}

/** schema.org author: string | Person/Organization {name} | array of either. */
function authorName(author: unknown): string | undefined {
  if (typeof author === "string") return cleanText(author);
  if (Array.isArray(author)) {
    const names = author.map(authorName).filter((n): n is string => !!n);
    return names.length ? names.join(", ") : undefined;
  }
  if (author && typeof author === "object") {
    return authorName((author as Record<string, unknown>).name);
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Text & URL helpers
// ---------------------------------------------------------------------------

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code =
        entity[1].toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function cleanText(value: string | undefined): string | undefined {
  const text = value ? decodeEntities(value).replace(/\s+/g, " ").trim() : "";
  return text || undefined;
}

/**
 * Resolve an absolute, protocol-relative, root-relative or page-relative
 * reference to an http(s) URL. Anything else (data:, mailto:, junk) → undefined.
 */
function toAbsoluteHttpUrl(value: string | undefined, pageUrl: string): string | undefined {
  const ref = value?.trim();
  if (!ref) return undefined;
  if (/^https?:\/\//i.test(ref)) return percentEncodeUnsafe(ref);
  if (/^[a-z][a-z0-9+.-]*:/i.test(ref)) return undefined; // some other scheme

  const originMatch = pageUrl.match(/^(https?:)\/\/[^/?#]+/i);
  if (!originMatch) return undefined;
  const [origin, protocol] = originMatch;

  if (ref.startsWith("//")) return percentEncodeUnsafe(`${protocol}${ref}`);
  if (ref.startsWith("/")) return percentEncodeUnsafe(`${origin}${ref}`);

  const directory = pageUrl.replace(/[?#].*$/, "").replace(/[^/]*$/, "");
  return percentEncodeUnsafe(`${directory}${ref}`);
}

/**
 * Hebrew sites commonly publish image URLs with raw Hebrew in the path
 * (`.../DSC_0055-עותק.jpg`). iOS networking rejects those, so encode only
 * the non-ASCII / whitespace runs — existing %XX escapes are left untouched.
 */
function percentEncodeUnsafe(url: string): string {
  return url.replace(/[^\x21-\x7e]+/g, (run) => encodeURIComponent(run));
}
