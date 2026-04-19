import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { useData } from "@/lib/data";

const Projects = () => {
  const { projects, allTopics, loading } = useData();
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const filteredProjects = tagFilter
    ? projects.filter((p) => p.topics?.includes(tagFilter))
    : projects;

  const tagEntries = Object.entries(allTopics);

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
        <span className="text-primary">//</span> Projects
      </h1>
      <p className="mb-2 text-xs text-muted-foreground">
        Open source projects Auto-fetched from GitHub.
      </p>
      <p className="mb-8 text-xs text-muted-foreground">
        Total: <span className="text-primary font-semibold">{projects.length}</span> repos
        {tagFilter && (
          <span> · Showing: <span className="text-primary font-semibold">{filteredProjects.length}</span> for "#{tagFilter}"</span>
        )}
      </p>

      {/* Tag filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setTagFilter(null)}
          className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
            !tagFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          all ({projects.length})
        </button>
        {tagEntries.slice(0, 15).map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
              tagFilter === tag ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {tag} ({count})
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <p className="py-8 text-center text-xs text-muted-foreground">No projects found.</p>
      )}
    </div>
  );
};

export default Projects;