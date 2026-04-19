import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "..", "backend", "data");
const outDir = path.join(__dirname, "public");

const files = ["posts.json", "projects.json", "references.json"];

for (const file of files) {
  const srcPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, outPath);
    console.log(`Copied ${file} to public/`);
  }
}