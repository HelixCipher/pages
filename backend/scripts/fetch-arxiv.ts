import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  published: string;
  authors: string[];
  url: string;
}

export async function fetchArxivPapers(ids: string[]): Promise<Record<string, ArxivPaper>> {
  if (ids.length === 0) return {};

  const uniqueIds = [...new Set(ids)];
  const url = `https://export.arxiv.org/api/query?id_list=${uniqueIds.join(",")}`;
  
  console.log(`  → Fetching ${uniqueIds.length} arXiv papers...`);
  
  try {
    const response = await fetch(url);
    const xml = await response.text();
    
    const papers: Record<string, ArxivPaper> = {};
    
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
        // ID might include version like "2503.11926v1" - normalize to just the base ID
        const fullId = idMatch[1];
        const id = fullId.replace(/v\d+$/, ""); // Remove version suffix
        const url = `https://arxiv.org/abs/${fullId}`;
        papers[id] = {
          id,
          title: titleMatch[1].replace(/\s+/g, " ").trim(),
          summary: summaryMatch ? summaryMatch[1].replace(/\s+/g, " ").trim() : "",
          published: publishedMatch ? publishedMatch[1] : "",
          authors,
          url,
        };
      }
    }
    
    console.log(`  → Fetched ${Object.keys(papers).length} papers`);
    return papers;
  } catch (error) {
    console.error(`  → Error fetching arXiv papers: ${error}`);
    return {};
  }
}

export function extractArxivIdsFromContent(content: string): string[] {
  const regex = /https:\/\/arxiv\.org\/(?:abs|pdf|html|ps|format)\/(\d+\.\d+)/g;
  const ids: string[] = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  
  return ids;
}

export function extractReferencesSection(content: string): string[] {
  const lines = content.split("\n");
  let inReferences = false;
  const referenceIds: string[] = [];
  
  for (const line of lines) {
    if (line.match(/^#{1,3}\s*(?:References|Papers|Links|Sources)/i)) {
      inReferences = true;
      continue;
    }
    
    if (inReferences) {
      if (line.startsWith("## ") || line.startsWith("# ")) {
        break;
      }
      
      const match = line.match(/https:\/\/arxiv\.org\/(?:abs|pdf|html|ps|format)\/(\d+\.\d+)/);
      if (match) {
        referenceIds.push(match[1]);
      }
    }
  }
  
  return referenceIds;
}