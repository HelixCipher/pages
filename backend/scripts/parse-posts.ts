import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  readingTime: number;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function parsePosts(): Post[] {
  const postsDir = path.join(__dirname, "..", "content", "posts");
  
  if (!fs.existsSync(postsDir)) {
    console.log(`Posts directory does not exist: ${postsDir}`);
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  console.log(`Found ${files.length} markdown files`);

  const posts: Post[] = [];

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const slug = file.replace(".md", "");
    
    posts.push({
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      content: content.trim(),
      readingTime: calculateReadingTime(content),
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  console.log(`Parsed ${posts.length} posts`);

  return posts;
}

export function getAllTags(posts: Post[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort();
}

export function main() {
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const posts = parsePosts();
  const tags = getAllTags(posts);
  const outputPath = path.join(__dirname, "..", "data", "posts.json");

  const output = {
    posts,
    tags,
    fetched_at: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Wrote posts to: ${outputPath}`);
}

if (import.meta.url === process.argv[1]) {
  main();
}