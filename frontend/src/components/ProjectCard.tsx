import { Star, Github } from "lucide-react";
import type { Project } from "@/lib/data";

const ProjectCard = ({ project }: { project: Project }) => {
  const hasStars = project.stargazers_count && project.stargazers_count > 0;
  
  return (
    <a
      href={project.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded border border-border bg-card p-5 transition-all hover:border-primary/40 hover:border-glow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono text-sm font-semibold text-foreground">{project.name}</h3>
        {hasStars && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            {project.stargazers_count}
          </span>
        )}
      </div>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{project.description}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.topics?.slice(0, 5).map((tech) => (
          <span key={tech} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-terminal-cyan">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Github className="h-3.5 w-3.5" />
          Click to view
        </span>
        {project.language && (
          <span className="text-muted-foreground">
            {project.language}
          </span>
        )}
      </div>
    </a>
  );
};

export default ProjectCard;