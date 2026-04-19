import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import { useData } from "@/lib/data";
import CopyButton from "@/components/CopyButton";

function getYouTubeVideoId(text: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getArxivIdFromUrl(url: string): string | null {
  const match = url.match(/arxiv\.org\/(?:abs|pdf|html|ps|format)\/(\d+\.\d+)/);
  return match ? match[1] : null;
}

function getArxivIdFromUrlWithVersion(url: string): string | null {
  const match = url.match(/arxiv\.org\/(?:abs|pdf|html|ps|format)\/(\d+\.\d+v\d+)/);
  return match ? match[1].replace(/v\d+$/, "") : null;
}

function getPaperById(papers: Record<string, any>, id: string): any {
  // Check for base ID or ID with version suffix
  return papers[id] || papers[`${id}v1`] || papers[`${id}v2`];
}

function renderArxivCard(paper: any, key: string) {
  return (
    <div key={key} className="my-4 rounded-md border border-border bg-secondary/30 p-4">
      <a
        href={paper.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 block font-mono text-sm font-bold text-primary hover:underline"
      >
        [{paper.id}] {paper.title}
      </a>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
        {paper.summary.length > 500 ? paper.summary.substring(0, 500) + "..." : paper.summary}
      </p>
      <a
        href={paper.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-primary hover:underline"
      >
        arxiv.org →
      </a>
    </div>
  );
}

function processArxivLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(https:\/\/arxiv\.org\/abs\/(\d+\.\d+))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[1]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        arXiv:{match[2]}
      </a>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

const BlogPost = () => {
  const { slug } = useParams();
  const { posts, arxivPapers, references, loading } = useData();
  const post = posts.find((p) => p.slug === slug);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      Prism.highlightAllUnder(contentRef.current);
    }
  }, [post]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="mt-4 inline-block text-xs text-primary hover:underline">
          ← Back to blog
        </Link>
      </div>
    );
  }

const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;
    let inReferences = false;
    let referenceIds: string[] = [];
    let referenceUrls: { url: string; arxivId?: string }[] = [];

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim() || "plaintext";
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        const codeText = codeLines.join("\n");
        elements.push(
          <div key={`code-${elements.length}`} className="group relative my-4">
            <CopyButton code={codeText} />
            <pre className="overflow-x-auto rounded border border-border bg-secondary/50 p-4">
              <code className={`language-${lang} text-xs font-mono`}>
                {codeText}
              </code>
            </pre>
          </div>
        );
        continue;
      }

      // Check for References section - also render pending refs first
      if (line.match(/^#{1,3}\s*(?:References|Papers|Links|Sources)/i)) {
        // Render any pending reference cards from previous section
        if (referenceUrls.length > 0) {
          for (const ref of referenceUrls) {
            const { url, arxivId } = ref;
            if (arxivId) {
              const paper = getPaperById(arxivPapers, arxivId);
              if (paper) {
                elements.push(renderArxivCard(paper, `ref-${url}`));
              }
            } else {
              const genericRef = references[url];
              if (genericRef) {
                elements.push(
                  <div key={`ref-${url}`} className="my-4 rounded-md border border-border bg-secondary/30 p-4">
                    <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">{genericRef.type}</div>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="mb-2 block font-mono text-sm font-bold text-primary hover:underline">
                      {genericRef.title}
                    </a>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                      {new URL(url).hostname} →
                    </a>
                  </div>
                );
              }
            }
          }
          referenceUrls = [];
        }
        inReferences = true;
        elements.push(
          <h2 key={i} className="mb-3 mt-8 font-mono text-lg font-bold text-foreground">
            {line.replace(/^#{1,3}\s*/, "")}
          </h2>
        );
        i++;
        continue;
      }

      // Collect URLs in References section - all URLs, not just arXiv
      if (inReferences) {
        // Handle both raw URLs and bullet point format (- https://...)
        const cleanLine = line.replace(/^-\s*/, "");
        const urlMatch = cleanLine.match(/(https:\/\/[^\s]+)/);
        if (urlMatch) {
          const url = urlMatch[1];
          // Try to extract arxiv ID first
          const arxivId = getArxivIdFromUrl(url) || getArxivIdFromUrlWithVersion(url);
          referenceUrls.push({ url, arxivId });
        }
        // Check if we should end references section (new header or non-link content)
        if (line.startsWith("# ") || (line.trim() && !line.match(/^https?:\/\//))) {
          for (const ref of referenceUrls) {
            const { url, arxivId } = ref;
            // Try arxiv first
            if (arxivId) {
              const paper = getPaperById(arxivPapers, arxivId);
              if (paper) {
                elements.push(renderArxivCard(paper, `ref-${url}`));
                continue;
              }
            }
            // Fall back to generic reference if exists
            const genericRef = references[url];
            if (genericRef) {
              elements.push(
                <div key={`ref-${url}`} className="my-4 rounded-md border border-border bg-secondary/30 p-4">
                  <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">{genericRef.type}</div>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="mb-2 block font-mono text-sm font-bold text-primary hover:underline">
                    {genericRef.title}
                  </a>
                  {genericRef.summary && (
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                      {genericRef.summary.length > 500 ? genericRef.summary.substring(0, 500) + "..." : genericRef.summary}
                    </p>
                  )}
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                    {new URL(url).hostname} →
                  </a>
                </div>
              );
              continue;
            }
            // Final fallback: simple link card
            try {
              elements.push(
                <div key={`ref-${url}`} className="my-4 rounded-md border border-border bg-secondary/30 p-4">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="mb-2 block font-mono text-sm font-bold text-primary hover:underline">
                    {new URL(url).hostname}
                  </a>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                    {new URL(url).hostname} →
                  </a>
                </div>
              );
            } catch {
              // Invalid URL, skip
            }
          }
          referenceUrls = [];
          inReferences = false;
        }
      }

      // H2 headers (##)
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="mb-3 mt-8 font-mono text-lg font-bold text-foreground">
            {line.replace("## ", "")}
          </h2>
        );
      // Bullet points (◾)
      } else if (line.startsWith("◾")) {
        elements.push(
          <li key={i} className="mb-1 ml-4 list-disc text-sm text-muted-foreground">
            {processArxivLinks(line.slice(1).trim())}
          </li>
        );
      // Bold key-value
      } else if (line.startsWith("- **")) {
        const match = line.match(/^- \*\*(.+?)\*\*: (.+)/);
        if (match) {
          elements.push(
            <li key={i} className="mb-1 ml-4 list-disc text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{match[1]}</span>: {match[2]}
            </li>
          );
        }
      // Bullet list in References section - don't process inline (cards render separately)
      } else if (inReferences && line.startsWith("- ") && line.match(/^https?:\/\//)) {
        // Skip - these get rendered as cards instead
      // Plain URL in References section - don't process inline (cards render separately)
      } else if (inReferences && line.match(/^https?:\/\//)) {
        // Skip - these get rendered as cards instead
      // Numbered lists
      } else if (/^\d+\. /.test(line)) {
        elements.push(
          <li key={i} className="mb-1 ml-4 list-decimal text-sm text-muted-foreground">
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      // Empty lines
      } else if (line.trim() === "") {
        elements.push(<br key={i} />);
      // Regular paragraph with special handling
      } else {
        const youtubeId = getYouTubeVideoId(line);
        if (youtubeId) {
          elements.push(
            <div key={i} className="my-4 aspect-video w-full">
              <iframe
                className="w-full h-full rounded"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video"
              />
            </div>
          );
        } else {
          const parts = line.split(/(`[^`]+`)/g);
          elements.push(
            <p key={i} className="mb-2 text-sm leading-relaxed text-muted-foreground">
              {parts.map((part, j) =>
                part.startsWith("`") && part.endsWith("`") ? (
                  <code key={j} className="rounded bg-secondary px-1.5 py-0.5 text-xs text-primary font-mono">
                    {part.slice(1, -1)}
                  </code>
                ) : (
                  processArxivLinks(part)
                )
              )}
            </p>
          );
        }
      }
      i++;
    }

    // Render any remaining reference cards at end of post
    if (inReferences && referenceUrls.length > 0) {
      for (const ref of referenceUrls) {
        const { url, arxivId } = ref;
        if (arxivId) {
          const paper = getPaperById(arxivPapers, arxivId);
          if (paper) {
            elements.push(renderArxivCard(paper, `ref-${url}`));
          }
        } else {
          const genericRef = references[url];
          if (genericRef) {
            elements.push(
              <div key={`ref-${url}`} className="my-4 rounded-md border border-border bg-secondary/30 p-4">
                <div className="mb-1 text-[10px] font-medium uppercase text-muted-foreground">{genericRef.type}</div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="mb-2 block font-mono text-sm font-bold text-primary hover:underline">
                  {genericRef.title}
                </a>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">
                  {new URL(url).hostname} →
                </a>
              </div>
            );
          }
        }
      }
    }

    return elements;
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Link
        to="/blog"
        className="mb-8 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        back to blog
      </Link>

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">{post.title}</h1>

        <div className="mb-8 flex flex-wrap gap-1.5">
          {post.tags?.map((tag) => (
            <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
              #{tag}
            </span>
          ))}
        </div>

        <div ref={contentRef} className="border-t border-border pt-8">{renderContent(post.content)}</div>
      </article>
    </div>
  );
};

export default BlogPost;