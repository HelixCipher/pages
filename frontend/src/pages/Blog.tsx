import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "@/components/PostCard";
import { useData } from "@/lib/data";

const Blog = () => {
  const [searchParams] = useSearchParams();
  const tagParam = searchParams.get("tag");
  const [activeTag, setActiveTag] = useState<string | null>(tagParam);
  const { posts, postTags, loading } = useData();

  useEffect(() => {
    setActiveTag(tagParam);
  }, [tagParam]);

  const filtered = activeTag ? posts.filter((p) => p.tags?.includes(activeTag)) : posts;

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        <span className="text-primary">//</span> Blog
      </h1>
      <p className="mb-8 text-xs text-muted-foreground">
        Thoughts on security, code, and design.
        <span className="ml-2 text-primary">• {filtered.length} posts published</span>
      </p>

      {/* Tag filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
            !activeTag ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          all
        </button>
        {postTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
              activeTag === tag ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-xs text-muted-foreground">No posts found.</p>
      )}
    </div>
  );
};

export default Blog;