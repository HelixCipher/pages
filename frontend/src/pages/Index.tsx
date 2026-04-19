import { Link } from "react-router-dom";
import { Terminal, ArrowRight } from "lucide-react";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import { useData } from "@/lib/data";

const Index = () => {
  const { posts, projects, loading } = useData();
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const featuredPosts = posts.slice(0, 2);
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      {/* Hero */}
      <section className="mb-16 animate-fade-up">
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          <span>~/helixcipher</span>
          <span className="cursor-blink text-primary" />
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Hello, I'm <span className="text-primary text-glow">HelixCipher</span>
        </h1>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
          Data scientist specialized in AI & Cybersecurity, and builder of things that live in terminals.
          I write about Cybersecurity and AI.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded border border-primary bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Read the blog <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            About me
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="mb-16" style={{ animationDelay: "0.1s" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
            // recent posts
          </h2>
          <Link to="/blog" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            view all →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ animationDelay: "0.2s" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
            // projects
          </h2>
          <Link to="/projects" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            view all →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;