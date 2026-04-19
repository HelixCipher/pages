/**
 * Run with: npx tsx scripts/generate-rss.ts
 * Generates public/rss.xml and public/atom.xml
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  tags: string[];
  readingTime: number;
}

// Inline the posts data to avoid import issues with path aliases
const posts: Post[] = [
  {
    slug: "building-a-cipher-engine",
    title: "Building a Cipher Engine from Scratch",
    excerpt: "Exploring the fundamentals of encryption by building a substitution cipher engine in TypeScript.",
    content: "",
    published_at: "2025-03-15",
    tags: ["cryptography", "typescript", "security"],
    readingTime: 5,
  },
  {
    slug: "terminal-ui-design-philosophy",
    title: "Terminal UI: A Design Philosophy",
    excerpt: "Why terminal-inspired design is more than aesthetic—it's a philosophy of focused, efficient interfaces.",
    content: "",
    published_at: "2025-02-28",
    tags: ["design", "ui", "terminal"],
    readingTime: 4,
  },
  {
    slug: "wasm-sqlite-browser",
    title: "Running SQLite in the Browser with WASM",
    excerpt: "How to use sql.js to run SQLite databases entirely in the browser using WebAssembly.",
    content: "",
    published_at: "2025-01-20",
    tags: ["wasm", "sqlite", "javascript"],
    readingTime: 6,
  },
];

const SITE_URL = "https://helixcipher.dev";
const SITE_TITLE = "HelixCipher";
const SITE_DESCRIPTION = "Thoughts on security, code, and design.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRSS(): string {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

function generateAtom(): string {
  const entries = posts
    .map(
      (p) => `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${SITE_URL}/blog/${p.slug}"/>
    <id>${SITE_URL}/blog/${p.slug}</id>
    <updated>${p.published_at}T00:00:00Z</updated>
    <summary>${escapeXml(p.excerpt)}</summary>
    ${p.tags.map((t) => `<category term="${escapeXml(t)}"/>`).join("\n    ")}
  </entry>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <link href="${SITE_URL}"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}/</id>
  <updated>${new Date().toISOString()}</updated>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
${entries}
</feed>`;
}

const publicDir = resolve(import.meta.dirname, "..", "public");
writeFileSync(resolve(publicDir, "rss.xml"), generateRSS(), "utf-8");
writeFileSync(resolve(publicDir, "atom.xml"), generateAtom(), "utf-8");
console.log("✅ Generated rss.xml and atom.xml");
