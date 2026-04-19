import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = "https://api.github.com";

function getOwner(): string {
  // Priority: CLI env > GitHub Actions env > default
  if (process.env.GITHUB_REPOSITORY_OWNER) {
    return process.env.GITHUB_REPOSITORY_OWNER;
  }
  if (process.env.OWNER) {
    return process.env.OWNER;
  }
  return "helixcipher"; // Default fallback
}

const OWNER = getOwner();

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  default_branch: string;
  fork: boolean;
}

const HEADERS = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "pages/1.0",
};

async function fetchWithAuth(url: string, token?: string): Promise<Response> {
  const headers = { ...HEADERS };
  if (token) {
    headers.Authorization = `token ${token}`;
  }
  return fetch(url, { headers, timeout: 30000 });
}

async function paginate(
  url: string,
  token?: string
): Promise<GitHubRepo[]> {
  const items: GitHubRepo[] = [];
  let curUrl = url;

  while (curUrl) {
    const response = await fetchWithAuth(curUrl, token);
    if (response.status >= 400) {
      throw new Error(
        `GitHub API error ${response.status}: ${response.text}`
      );
    }
    const data = await response.json();
    items.push(...data);
    
    const linkHeader = response.headers.get("Link");
    if (!linkHeader) break;
    
    const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    curUrl = nextMatch ? nextMatch[1] : "";
  }

  return items;
}

export async function fetchRepos(token?: string): Promise<GitHubRepo[]> {
  const url = `${API_BASE}/users/${OWNER}/repos?per_page=100&type=owner&sort=pushed`;
  console.log(`Fetching repos from: ${url}`);
  
  const repos = await paginate(url, token);
  console.log(`Found ${repos.length} repos`);

  const publicRepos = repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      topics: repo.topics,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      pushed_at: repo.pushed_at,
      default_branch: repo.default_branch,
    }));

  console.log(`Filtered to ${publicRepos.length} non-fork public repos`);
  return publicRepos;
}

export function getAllTopics(repos: GitHubRepo[]): Map<string, number> {
  const topicCount = new Map<string, number>();
  
  for (const repo of repos) {
    for (const topic of repo.topics) {
      topicCount.set(topic, (topicCount.get(topic) || 0) + 1);
    }
  }

  const sortedTopics = new Map(
    [...topicCount.entries()].sort((a, b) => b[1] - a[1])
  );

  return sortedTopics;
}

export async function main() {
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const token = process.env.GITHUB_TOKEN;
  const outputPath = path.join(dataDir, "projects.json");

  const repos = await fetchRepos(token);
  const topics = getAllTopics(repos);

  const output = {
    repos,
    topics: Object.fromEntries(topics),
    fetched_at: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Wrote projects to: ${outputPath}`);
}

if (import.meta.url === process.argv[1]) {
  main().catch(console.error);
}