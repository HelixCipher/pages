import { Shield, Github, Mail, Terminal } from "lucide-react";

const skills = [
  { category: "Languages", items: ["TypeScript", "Rust", "Go", "Python"] },
  { category: "Security", items: ["Cryptography", "Pen Testing", "OSINT", "Threat Modeling"] },
  { category: "Tools", items: ["Linux", "Docker", "Git", "Neovim"] },
  { category: "Web", items: ["React", "Node.js", "WebAssembly", "Tailwind"] },
];

const About = () => (
  <div className="container mx-auto max-w-3xl px-4 py-16">
    <h1 className="mb-2 text-2xl font-bold text-foreground">
      <span className="text-primary">//</span> About
    </h1>
    <p className="mb-8 text-xs text-muted-foreground">whoami</p>

    <div className="mb-10 rounded border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-primary/30 bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-mono text-sm font-bold text-foreground">HelixCipher</h2>
          <p className="text-xs text-muted-foreground">Data scientist & Red Team Operator</p>
        </div>
      </div>
      <div className="space-y-3 font-sans text-sm leading-relaxed text-muted-foreground">
        <p>
          I'm a Data scientist and a Red Team Operator with a deep interest in cryptography, systems security, and building
          tools that respect privacy. I believe in open source and the sharing of knowledge.
        </p>
        <p>
          When I'm not writing code, I'm probably reading about zero-knowledge proofs, exploring
          CTF challenges, or configuring my terminal for the hundredth time.
        </p>
      </div>
    </div>

    {/* Skills */}
    <div className="mb-10">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
        // skills
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category} className="rounded border border-border bg-card p-4">
            <h3 className="mb-2 flex items-center gap-2 font-mono text-xs font-semibold text-foreground">
              <Terminal className="h-3 w-3 text-primary" />
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Contact */}
    <div>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
        // contact
      </h2>
      <div className="flex flex-wrap gap-3">
        <a
          href="https://github.com/HelixCipher"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Github className="h-3.5 w-3.5" />
          GitHub
        </a>
        <a
          href="mailto:hello@helixcipher.dev"
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Mail className="h-3.5 w-3.5" />
          Email
        </a>
      </div>
    </div>
  </div>
);

export default About;
