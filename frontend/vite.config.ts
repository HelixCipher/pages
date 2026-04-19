import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

function copyDataPlugin() {
  return {
    name: "copy-data",
    closeBundle() {
      const srcDir = path.join(__dirname, "../backend/data");
      const outDir = path.join(__dirname, "dist");
      
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      const files = ["posts.json", "projects.json", "references.json", "rss.xml", "atom.xml"];
      for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const outPath = path.join(outDir, file);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, outPath);
          console.log(`Copied ${file} to dist/`);
        }
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Get repo name from environment or default
  // In GitHub Actions: REPO_NAME is passed from workflow
  // Locally: defaults to pages
  const repoName = process.env.REPO_NAME || "pages";
  const basePath = `/${repoName}/`;
  
  return {
    base: basePath,
    define: {
      __REPO_NAME__: JSON.stringify(repoName),
      __SITE_TITLE__: JSON.stringify(repoName),
    },
    server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), copyDataPlugin()],
  publicDir: "public",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  };
});