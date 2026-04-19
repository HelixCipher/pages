import { fetchRepos, getAllTopics } from "./fetch-repos.js";
import { parsePosts, getAllTags } from "./parse-posts.js";
import { generateRSSFiles } from "./generate-rss.js";
import { fetchAllReferences, extractReferencesFromContent } from "./fetch-references.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPOSITORY_OWNER || "helixcipher";
const REPO_NAME = process.env.REPO_NAME || "pages";

function getSiteUrl(): string {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  return `https://${REPO_OWNER}.github.io/${REPO_NAME}`;
}

async function main() {
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log("=== HelixCipher Build ===\n");

  console.log("1. Fetching GitHub repos...");
  const repos = await fetchRepos(GITHUB_TOKEN);
  const topicCounts = getAllTopics(repos);

  const projectsOutput = {
    repos,
    topics: Object.fromEntries(topicCounts),
    fetched_at: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, "..", "data", "projects.json"),
    JSON.stringify(projectsOutput, null, 2)
  );
  console.log("  → Projects JSON generated\n");

  console.log("2. Parsing Markdown posts...");
  const posts = parsePosts();
  const tags = getAllTags(posts);

  const postsOutput = {
    posts,
    tags,
    fetched_at: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(__dirname, "..", "data", "posts.json"),
    JSON.stringify(postsOutput, null, 2)
  );
  console.log("  → Posts JSON generated\n");

  console.log("3. Fetching references (arXiv, DOI, GitHub, generic)...");
  const references = await fetchAllReferences(posts);
  
  fs.writeFileSync(
    path.join(__dirname, "..", "data", "references.json"),
    JSON.stringify(references, null, 2)
  );
  console.log(`  → References fetched: ${Object.keys(references).length}\n`);

  console.log("4. Generating RSS feeds...");
  const siteUrl = getSiteUrl();
  generateRSSFiles(posts, siteUrl);
  console.log(`  → Site URL: ${siteUrl}\n`);

  console.log("=== Build Complete ===");
  console.log(`  - ${posts.length} posts`);
  console.log(`  - ${repos.length} repos`);
  console.log(`  - ${topicCounts.size} unique topics`);
  console.log(`  - ${Object.keys(references).length} references`);
  console.log(`  - Site URL: ${siteUrl}`);
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});