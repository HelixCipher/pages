import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface Reference {
  url: string;
  type: "arxiv" | "doi" | "github" | "generic";
  id?: string;
  title?: string;
  summary?: string;
  authors?: string[];
  published?: string;
  stars?: number;
  language?: string;
  description?: string;
}

export interface ReferencesData {
  [url: string]: Reference;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeArxivId(id: string): string {
  // Only strip version if explicitly marked with "v" prefix (e.g., 2503.11926v1)
  // arXiv IDs like 2503.11926 should NOT be modified
  if (id.includes("v") && id.match(/^\d+\.\d+v\d+$/)) {
    return id.replace(/v\d+$/, "");
  }
  return id;
}

function extractArxivIds(content: string): string[] {
  const regex = /https:\/\/arxiv\.org\/(?:abs|pdf|html|ps|format)\/(\d+\.\d+)/g;
  const ids: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(normalizeArxivId(match[1]));
  }
  return [...new Set(ids)];
}

function extractDOIs(content: string): string[] {
  const regex = /https?:\/\/(?:doi\.org\/|10\.\d{4,5}\/)([^\s]+)/g;
  const ids: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return [...new Set(ids)];
}

function extractGitHubRepos(content: string): string[] {
  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\s\)]+)/g;
  const repos: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    repos.push(`${match[1]}/${match[2]}`);
  }
  return [...new Set(repos)];
}

function extractAllUrls(content: string): string[] {
  const regex = /https:\/\/[^\s]+/g;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[0]);
  }
  return urls;
}

export async function fetchArxivPapers(ids: string[]): Promise<Record<string, any>> {
  if (ids.length === 0) return {};

  const uniqueIds = [...new Set(ids)];
  const papers: Record<string, any> = {};

  // arXiv API limit is 10 per request - chunk the IDs
  const chunkSize = 10;
  for (let i = 0; i < uniqueIds.length; i += chunkSize) {
    const chunk = uniqueIds.slice(i, i + chunkSize);
    const url = `https://export.arxiv.org/api/query?id_list=${chunk.join(",")}`;

    console.log(`  → Fetching arXiv papers ${i + 1}-${Math.min(i + chunkSize, uniqueIds.length)} of ${uniqueIds.length}...`);

    try {
      const response = await fetch(url);
      const xml = await response.text();

      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
      let match;

      while ((match = entryRegex.exec(xml)) !== null) {
        const entry = match[1];

        const idMatch = entry.match(/<id>https?:\/\/arxiv\.org\/abs\/([^<]+)<\/id>/);
        const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
        const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
        const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);

        const authorRegex = /<author>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/author>/g;
        const authors: string[] = [];
        let authorMatch;
        while ((authorMatch = authorRegex.exec(entry)) !== null) {
          authors.push(authorMatch[1]);
        }

        if (idMatch && titleMatch) {
          const fullId = idMatch[1];
          const id = normalizeArxivId(fullId);
          const absUrl = `https://arxiv.org/abs/${fullId}`;
          const pdfUrl = `https://arxiv.org/pdf/${fullId}`;

          papers[id] = {
            type: "arxiv",
            id,
            url: absUrl,
            pdfUrl,
            title: titleMatch[1].replace(/\s+/g, " ").trim(),
            summary: summaryMatch ? summaryMatch[1].replace(/\s+/g, " ").trim() : "",
            published: publishedMatch ? publishedMatch[1] : "",
            authors,
          };
        }
      }
    } catch (error) {
      console.error(`  → Error fetching arXiv chunk: ${error}`);
    }
  }

  console.log(`  → Fetched ${Object.keys(papers).length} arXiv papers`);
  return papers;
}

async function fetchDOIMetadata(dois: string[]): Promise<Record<string, any>> {
  const results: Record<string, any> = {};

  for (const doi of dois) {
    try {
      const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
        headers: { "User-Agent": "HelixCipher/1.0 (https://helixcipher.github.io; mailto:hello@helixcipher.dev)" },
      });

      if (response.ok) {
        const data = await response.json();
        const work = data.message;
        results[doi] = {
          type: "doi",
          id: doi,
          url: `https://doi.org/${doi}`,
          title: work.title?.[0] || "",
          summary: work.abstract || work.description || "",
          published: work.published?.["date-parts"]?.[0]?.join("-") || "",
          authors: work.author?.map((a: any) => `${a.given} ${a.family}`).filter(Boolean) || [],
          journal: work["container-title"]?.[0] || "",
        };
      }
    } catch (error) {
      console.error(`  → Error fetching DOI ${doi}: ${error}`);
    }
    await delay(100);
  }

  return results;
}

async function fetchGitHubRepos(repos: string[]): Promise<Record<string, any>> {
  const results: Record<string, any> = {};

  for (const repo of repos) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "HelixCipher/1.0",
        },
      });

      if (response.ok) {
        const data = await response.json();
        results[repo] = {
          type: "github",
          id: repo,
          url: data.html_url,
          title: data.name,
          description: data.description || "",
          summary: data.description || "",
          stars: data.stargazers_count,
          language: data.language,
          published: data.created_at,
          authors: [data.owner?.login],
        };
      }
    } catch (error) {
      console.error(`  → Error fetching GitHub ${repo}: ${error}`);
    }
    await delay(100);
  }

  return results;
}

async function fetchGenericMetadata(urls: string[]): Promise<Record<string, any>> {
  const results: Record<string, any> = {};

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (response.ok) {
        const html = await response.text();

        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
        const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i);

        const title = ogTitleMatch?.[1] || titleMatch?.[1] || "";
        const description = ogDescMatch?.[1] || descMatch?.[1] || "";

        if (title) {
          results[url] = {
            type: "generic",
            url,
            title: title.substring(0, 200),
            summary: description.substring(0, 500),
          };
        }
      }
    } catch (error) {
      // Silently fail for generic URLs
    }
    await delay(200);
  }

  return results;
}

export async function fetchAllReferences(posts: { content: string }[]): Promise<ReferencesData> {
  console.log("  → Analyzing posts for references...");

  const arxivIds = new Set<string>();
  const dois = new Set<string>();
  const githubRepos = new Set<string>();
  const allUrls = new Set<string>();

  for (const post of posts) {
    extractArxivIds(post.content).forEach((id) => arxivIds.add(id));
    extractDOIs(post.content).forEach((id) => dois.add(id));
    extractGitHubRepos(post.content).forEach((repo) => githubRepos.add(repo));

    const urls = extractAllUrls(post.content);
    for (const url of urls) {
      if (
        !url.includes("arxiv.org") &&
        !url.includes("doi.org") &&
        !url.includes("github.com") &&
        !url.includes("youtube.com") &&
        !url.includes("youtu.be")
      ) {
        allUrls.add(url);
      }
    }
  }

  console.log(`  → Found ${arxivIds.size} arXiv, ${dois.size} DOI, ${githubRepos.size} GitHub, ${allUrls.size} generic URLs`);

  const references: ReferencesData = {};

  const arxivPapers = await fetchArxivPapers([...arxivIds]);
  for (const [id, paper] of Object.entries(arxivPapers)) {
    const url = `https://arxiv.org/abs/${id}`;
    references[url] = paper;
    references[`https://arxiv.org/pdf/${id}`] = paper;
  }

  if (dois.size > 0) {
    console.log(`  → Fetching ${dois.size} DOI references...`);
    const doiResults = await fetchDOIMetadata([...dois]);
    Object.assign(references, doiResults);
  }

  if (githubRepos.size > 0) {
    console.log(`  → Fetching ${githubRepos.size} GitHub references...`);
    const githubResults = await fetchGitHubRepos([...githubRepos]);
    Object.assign(references, githubResults);
  }

  if (allUrls.size > 0) {
    console.log(`  → Fetching ${allUrls.size} generic references...`);
    const genericResults = await fetchGenericMetadata([...allUrls]);
    Object.assign(references, genericResults);
  }

  return references;
}

export function extractReferencesFromContent(content: string): string[] {
  const lines = content.split("\n");
  let inReferences = false;
  const urls: string[] = [];

  for (const line of lines) {
    if (line.match(/^#{1,3}\s*(?:References|Papers|Links|Sources)/i)) {
      inReferences = true;
      continue;
    }

    if (inReferences) {
      if (line.startsWith("## ") || line.startsWith("# ")) {
        break;
      }

      const match = line.match(/(https:\/\/[^\s]+)/);
      if (match && !match[1].includes("youtube.com") && !match[1].includes("youtu.be")) {
        urls.push(match[1]);
      }
    }
  }

  return urls;
}

export function main() {
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const postsDir = path.join(__dirname, "..", "content", "posts");
  if (!fs.existsSync(postsDir)) {
    console.log(`Posts directory does not exist: ${postsDir}`);
    return;
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = [];

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content } = fileContent.split("---")[2] ? { content: fileContent.split("---")[2] } : { content: "" };
    posts.push({ content: content.trim() });
  }

  fetchAllReferences(posts).then((references) => {
    const outputPath = path.join(__dirname, "..", "data", "references.json");
    fs.writeFileSync(outputPath, JSON.stringify(references, null, 2));
    console.log(`  → Wrote ${Object.keys(references).length} references to: ${outputPath}`);
  });
}

if (import.meta.url === process.argv[1]) {
  main();
}