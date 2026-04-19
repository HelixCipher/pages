import { fetchAllReferences } from "./fetch-references.js";
import fs from "fs";

const postsDir = "./content/posts";
const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
const posts = [];
for (const file of files) {
  const content = fs.readFileSync(`${postsDir}/${file}`, "utf-8");
  const parts = content.split("---");
  const body = parts.slice(2).join("---");
  posts.push({ content: body.trim() });
}

const refs = await fetchAllReferences(posts);
console.log("Total refs:", Object.keys(refs).length);
console.log("arXiv refs:", Object.keys(refs).filter(k => k.includes("arxiv.org/abs")).length);

// Write to references.json
fs.writeFileSync("./data/references.json", JSON.stringify(refs, null, 2));
console.log("Written to references.json");

// Check specific post references
const modelPost = posts.find(p => p.content.includes("models_that_deliberately_withhold"));
if (modelPost) {
  console.log("");
  console.log("=== Checking models_that_deliberately_withhold ===");
  const urls = [
    "https://arxiv.org/abs/2503.11926",
    "https://arxiv.org/abs/2412.14093",
    "https://arxiv.org/abs/2412.04984"
  ];
  for (const url of urls) {
    console.log("URL:", url);
    console.log("  Found:", !!refs[url]);
    console.log("  Title:", refs[url]?.title?.substring(0, 50));
  }
}