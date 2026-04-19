import { Github, Rss } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-background py-8">
    <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-xs text-muted-foreground md:flex-row md:justify-between">
      <span>© {new Date().getFullYear()} HelixCipher — All rights reserved</span>
      <div className="flex items-center gap-4">
        <a href="https://github.com/HelixCipher" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
          <Github className="h-4 w-4" />
        </a>
        <a href="rss.xml" className="hover:text-primary transition-colors">
          <Rss className="h-4 w-4" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
