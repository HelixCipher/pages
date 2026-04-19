import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, FolderGit2, Tag, Star } from "lucide-react";
import { useData } from "@/lib/data";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

type Filter = "all" | "posts" | "projects" | "tags";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "all" },
  { value: "posts", label: "posts" },
  { value: "projects", label: "projects" },
  { value: "tags", label: "tags" },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [tagFilter, setTopicFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { posts, projects, allTopics, loading } = useData();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const showPosts = filter === "all" || filter === "posts";
  const showProjects = filter === "all" || filter === "projects";
  const showTags = filter === "all" || filter === "tags";

  const filteredProjects = tagFilter
    ? projects.filter((p) => p.tags?.includes(tagFilter))
    : projects;

  const tagEntries = Object.entries(allTopics).slice(0, 20);

  if (loading) {
    return (
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Loading..." />
        <CommandList>
          <CommandEmpty>Loading data...</CommandEmpty>
        </CommandList>
      </CommandDialog>
    );
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-1.5 border-b border-border px-3 pt-2 pb-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setTopicFilter(null);
            }}
            className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      
      {showTags && tagEntries.length > 0 && (
        <div className="flex flex-wrap gap-1 border-b border-border px-3 pb-2">
          <button
            onClick={() => setTopicFilter(null)}
            className={`rounded px-2 py-0.5 text-[10px] transition-colors ${
              !tagFilter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            all
          </button>
          {tagEntries.map(([topic, count]) => (
            <button
              key={topic}
              onClick={() => setTopicFilter(tagFilter === topic ? null : topic)}
              className={`rounded px-2 py-0.5 text-[10px] transition-colors ${
                tagFilter === topic
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {topic} ({count})
            </button>
          ))}
        </div>
      )}
      
      <CommandInput placeholder="Search posts, projects, tags..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {showPosts && (
          <CommandGroup heading="Blog Posts">
            {posts.map((post) => (
              <CommandItem
                key={`post-${post.id}`}
                value={`${post.title} ${post.tags.join(" ")}`}
                onSelect={() => go(`/blog/${post.slug}`)}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-sm">{post.title}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {post.excerpt?.slice(0, 80)}…
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showPosts && showProjects && <CommandSeparator />}

        {showProjects && (
          <CommandGroup heading={`Projects${tagFilter ? ` (${tagFilter})` : ""}`}>
            {filteredProjects.map((project) => (
              <CommandItem
                key={`proj-${project.id}`}
                value={`${project.name} ${project.tags?.join(" ")}`}
                onSelect={() => go(`/projects`)}
                className="cursor-pointer"
              >
                <FolderGit2 className="mr-2 h-4 w-4 text-primary" />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{project.name}</span>
                    {project.stargazers_count > 0 && (
                      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {project.stargazers_count}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {project.description?.slice(0, 80)}…
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {(showPosts || showProjects) && showTags && <CommandSeparator />}

        {showTags && (
          <CommandGroup heading="Topics">
            {tagEntries.map(([topic, count]) => (
              <CommandItem
                key={`topic-${topic}`}
                value={topic}
                onSelect={() => {
                  setTopicFilter(topic);
                  setFilter("projects");
                }}
                className="cursor-pointer"
              >
                <Tag className="mr-2 h-4 w-4 text-primary" />
                <span className="text-sm">#{topic}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {count} repos
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;