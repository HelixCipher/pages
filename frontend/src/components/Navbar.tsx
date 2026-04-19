import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import SearchDialog from "./SearchDialog";

const navItems = [
  { path: "/", label: "home" },
  { path: "/blog", label: "blog" },
  { path: "/projects", label: "projects" },
  { path: "/about", label: "about" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-bold tracking-widest">
            HELIX<span className="text-foreground">CIPHER</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs tracking-wider transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? "text-primary text-glow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {location.pathname === item.path && (
                <span className="text-primary/60">{">"} </span>
              )}
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors ${
              theme === "dark" ? "bg-primary/20 shadow-[inset_0_0_8px_hsl(var(--primary)/0.4)]" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-primary shadow-sm ring-0 transition-transform duration-200 ${
                theme === "light" ? "translate-x-4" : "translate-x-0.5"
              } ${theme === "dark" ? "shadow-[0_0_6px_hsl(var(--primary)/0.6)]" : ""}`}
            />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors ${
              theme === "dark" ? "bg-primary/20 shadow-[inset_0_0_8px_hsl(var(--primary)/0.4)]" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-primary shadow-sm ring-0 transition-transform duration-200 ${
                theme === "light" ? "translate-x-4" : "translate-x-0.5"
              } ${theme === "dark" ? "shadow-[0_0_6px_hsl(var(--primary)/0.6)]" : ""}`}
            />
          </button>
          <button
            className="text-muted-foreground hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm tracking-wider ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="text-primary/60">$ </span>
              cd ~/{item.label}
            </Link>
          ))}
        </div>
      )}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
};

export default Navbar;
