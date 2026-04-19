import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import type { Post } from "@/lib/data";

const PostCard = ({ post }: { post: Post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group block rounded border border-border bg-card p-5 transition-all hover:border-primary/40 hover:border-glow"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min
          </span>
        </div>
        <h3 className="mb-2 font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags?.map((tag) => (
            <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  </Link>
);

export default PostCard;
