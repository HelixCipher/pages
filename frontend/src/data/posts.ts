import { calculateReadingTime } from "@/lib/readingTime";

export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  tech_stack: string[];
  repo_url: string;
  live_url?: string;
  image_url?: string;
  topics?: string[];
  stars?: number;
}

export const posts: Post[] = [
  {
    id: 1,
    slug: "building-a-cipher-engine",
    title: "Building a Cipher Engine from Scratch",
    content: `In this post, we'll explore how to build a simple substitution cipher engine using TypeScript. Ciphers have been used for centuries to protect information, and understanding their mechanics is fundamental to modern cryptography.

## The Basics

A substitution cipher replaces each letter in the plaintext with a corresponding letter from a shuffled alphabet. While easily broken by frequency analysis, it demonstrates core encryption concepts.

\`\`\`typescript
function encrypt(text: string, key: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return text.split('').map(char => {
    const idx = alphabet.indexOf(char.toUpperCase());
    return idx >= 0 ? key[idx] : char;
  }).join('');
}
\`\`\`

## Moving Forward

From here, you can explore polyalphabetic ciphers like Vigenère, or dive into modern symmetric encryption with AES. The journey from Caesar to quantum-resistant algorithms is a fascinating one.`,
    excerpt: "Exploring the fundamentals of encryption by building a substitution cipher engine in TypeScript.",
    date: "2025-03-15",
    tags: ["cryptography", "typescript", "security"],
    readingTime: 5,
  },
  {
    id: 2,
    slug: "terminal-ui-design-philosophy",
    title: "Terminal UI: A Design Philosophy",
    content: `The terminal aesthetic isn't just nostalgia—it's a design philosophy that prioritizes information density, keyboard navigation, and minimal distraction.

## Why Terminal UIs?

In an era of bloated web apps, terminal-inspired interfaces offer:

- **Focus**: No visual clutter competing for attention
- **Speed**: Text renders faster than complex layouts
- **Accessibility**: Screen readers work naturally with semantic text
- **Efficiency**: Keyboard-first navigation is measurably faster

## Design Principles

1. Monospace typography creates natural alignment
2. Green-on-dark reduces eye strain in low light
3. Minimal color palette forces hierarchy through spacing
4. Cursor-based interactions feel precise and intentional`,
    excerpt: "Why terminal-inspired design is more than aesthetic—it's a philosophy of focused, efficient interfaces.",
    date: "2025-02-28",
    tags: ["design", "ui", "terminal"],
    readingTime: 4,
  },
  {
    id: 3,
    slug: "wasm-sqlite-browser",
    title: "Running SQLite in the Browser with WASM",
    content: `WebAssembly has unlocked incredible possibilities, including running a full SQLite database entirely in the browser. Let's explore how sql.js makes this possible.

## Setup

\`\`\`bash
npm install sql.js
\`\`\`

## Loading a Database

\`\`\`typescript
import initSqlJs from 'sql.js';

const SQL = await initSqlJs();
const response = await fetch('/database/blog.db');
const buffer = await response.arrayBuffer();
const db = new SQL.Database(new Uint8Array(buffer));

const results = db.exec("SELECT * FROM posts WHERE published = 1");
\`\`\`

This approach is perfect for static sites where you want database-like querying without a server.`,
    excerpt: "How to use sql.js to run SQLite databases entirely in the browser using WebAssembly.",
    date: "2025-01-20",
    tags: ["wasm", "sqlite", "javascript"],
    readingTime: 6,
  },
].map((p) => ({ ...p, readingTime: calculateReadingTime(p.content) }));

export const projects: Project[] = [
  {
    id: 1,
    slug: "helix-cipher",
    title: "HelixCipher",
    description: "A blog and portfolio with a terminal-inspired design, powered by static data and deployed on GitHub Pages.",
    content: "Built with React, Vite, and Tailwind CSS. Features a hacker/terminal aesthetic with animated splash screen.",
    tech_stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    repo_url: "https://github.com/helixcipher/site",
  },
  {
    id: 2,
    slug: "cryptex-cli",
    title: "Cryptex CLI",
    description: "A command-line tool for encrypting and decrypting files using modern ciphers. Supports AES-256, ChaCha20, and custom key derivation.",
    content: "Built in Rust with a focus on security and performance.",
    tech_stack: ["Rust", "AES-256", "CLI", "OpenSSL"],
    repo_url: "https://github.com/helixcipher/cryptex",
  },
  {
    id: 3,
    slug: "phantom-proxy",
    title: "Phantom Proxy",
    description: "A lightweight, privacy-focused HTTP proxy that strips tracking headers and anonymizes requests.",
    content: "Written in Go with minimal dependencies.",
    tech_stack: ["Go", "Networking", "Privacy", "Docker"],
    repo_url: "https://github.com/helixcipher/phantom-proxy",
    live_url: "https://phantom.helixcipher.dev",
  },
];

export const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));