import { useEffect, useState } from "react";

export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  language: string | null;
}

export interface Reference {
  url: string;
  type: "arxiv" | "doi" | "github" | "generic";
  id?: string;
  title?: string;
  summary?: string;
  published?: string;
  authors?: string[];
  stars?: number;
  language?: string;
  description?: string;
}

export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  published: string;
  authors: string[];
  url: string;
}

export interface DataState {
  posts: Post[];
  projects: Project[];
  allTopics: Record<string, number>;
  postTags: string[];
  references: Record<string, Reference>;
  arxivPapers: Record<string, ArxivPaper>;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  posts: [],
  projects: [],
  allTopics: {},
  postTags: [],
  references: {},
  arxivPapers: {},
  loading: true,
  error: null,
};

// Dynamic base path - uses build-time define from vite.config.ts
const getBasePath = () => {
  // @ts-ignore - defined at build time by Vite
  if (typeof __REPO_NAME__ !== 'undefined') {
    return `/${__REPO_NAME__}`;
  }
  return ""; // Local dev fallback
};

export function useData() {
  const [data, setData] = useState<DataState>(initialState);

  useEffect(() => {
    async function loadData() {
      try {
        const basePath = getBasePath();
        const [postsRes, projectsRes, referencesRes] = await Promise.all([
          fetch(`${basePath}/posts.json`),
          fetch(`${basePath}/projects.json`),
          fetch(`${basePath}/references.json`),
        ]);

        if (!postsRes.ok || !projectsRes.ok) {
          throw new Error("Failed to load data");
        }

        const postsData = await postsRes.json();
        const projectsData = await projectsRes.json();
        const referencesData = referencesRes.ok ? await referencesRes.json() : {};

        const postsWithId = postsData.posts.map((p: any, i: number) => ({
          ...p,
          id: i + 1,
        }));

        const projectsWithId = projectsData.repos.map((r: any, i: number) => ({
          id: i + 1,
          name: r.name,
          description: r.description || "",
          html_url: r.html_url,
          topics: r.topics || [],
          stargazers_count: r.stargazers_count || 0,
          language: r.language,
        }));

        // Extract arxiv papers from references
        const arxivPapers: Record<string, ArxivPaper> = {};
        for (const [url, ref] of Object.entries(referencesData)) {
          if (ref.type === "arxiv" && ref.id) {
            arxivPapers[ref.id] = {
              id: ref.id,
              title: ref.title || "",
              summary: ref.summary || "",
              published: ref.published || "",
              authors: ref.authors || [],
              url: ref.url || url,
            };
          }
        }

        setData({
          posts: postsWithId,
          projects: projectsWithId,
          allTopics: projectsData.topics || {},
          postTags: postsData.tags || [],
          references: referencesData || {},
          arxivPapers,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to load data:", err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    }

    loadData();
  }, []);

  return data;
}