import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_TITLE = "HelixCipher";
const SITE_DESCRIPTION = "Thoughts on security, code, and design.";

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  readingTime: number;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRSS(posts: Post[], siteUrl: string): string {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${p.slug}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

function generateAtom(posts: Post[], siteUrl: string): string {
  const entries = posts
    .map(
      (p) => `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${siteUrl}/blog/${p.slug}"/>
    <id>${siteUrl}/blog/${p.slug}</id>
    <updated>${p.date}T00:00:00Z</updated>
    <summary>${escapeXml(p.excerpt)}</summary>
    ${p.tags.map((t) => `<category term="${escapeXml(t)}"/>`).join("\n    ")}
  </entry>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <link href="${siteUrl}"/>
  <link href="${siteUrl}/atom.xml" rel="self"/>
  <id>${siteUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle>
${entries}
</feed>`;
}

export function generateRSSFiles(posts: Post[], siteUrl: string) {
  const dataDir = path.join(__dirname, "..", "data");
  
  const rssPath = path.join(dataDir, "rss.xml");
  const atomPath = path.join(dataDir, "atom.xml");

  fs.writeFileSync(rssPath, generateRSS(posts, siteUrl), "utf-8");
  console.log(`  → Generated rss.xml`);

  fs.writeFileSync(atomPath, generateAtom(posts, siteUrl), "utf-8");
  console.log(`  → Generated atom.xml`);
}