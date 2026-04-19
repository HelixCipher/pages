# Pages


![preview](project_demonstration_gif.gif)

A blog and portfolio site featuring a terminal-inspired design, auto-fetched GitHub projects, and build-time markdown processing.

## Features

- **Terminal-themed UI**: Hacker/terminal aesthetic with dark/light mode toggle

- **Auto-fetched Projects**: All public GitHub repositories are fetched at build time via GitHub API.

- **Tag Filtering**: Search and filter projects by tags (machine-learning, cybersecurity, etc.).

- **Markdown Posts**: Write blog posts in markdown with YAML frontmatter.

- **GitHub Pages Deployment**: Fully automated via GitHub Actions.

- **Dynamic Configuration**: Automatically detects your username and repo name.

---

## Setting Up on Your Own GitHub Account

This guide walks you through setting up the blog to display your repositories on GitHub Pages.

### Prerequisites

- A Personal Access Token (PAT) with `repo` scope (for fetching repo data)

### Step 1: Fork the Repository

1. Go to https://github.com/HelixCipher/pages

2. Click "Fork"

3. Wait for the fork to complete

### Step 2: Enable GitHub Pages

1. Go to your forked repository -> Settings -> Pages

2. Under "Build and deployment", find "Source"

3. Select GitHub Actions

4. Click Save

### Step 3: Add Your Personal Access Token

1. Go to Settings -> Secrets and variables -> Actions

2. Click "New repository secret"

3. Name: TOKEN

4. Secret: Your Personal Access Token (PAT)

   - To create: Settings -> Developer settings -> Personal access tokens -> Tokens (classic)

   - Select the repo scope
5. Click "Add secret"

### Step 4: Run the Workflow

1. Go to Actions -> Deploy to GitHub Pages

2. Click "Run workflow"

3. Select the main branch

4. Click "Run workflow"

5. Wait for completion (~2 minutes)

### Step 5: Access Your Site

1. Go to Settings -> Pages

2. Find your site URL (usually: https://yourusername.github.io/your-repo-name/)

3. Click the link to view your site

### How It Works

1. GitHub Actions automatically detects your username from the repository.

2. Fetches all your public repositories via GitHub API.

3. Parses markdown posts from backend/content/posts/.

4. Builds and deploys to GitHub Pages.

---

## Adding a New Post

1. Create a new markdown file in backend/content/posts/:

```markdown
---
title: "Your Post Title"
date: "2025-04-12"
excerpt: "A brief description of your post."
tags: ["tag1", "tag2"]
---

Your markdown content here...

## Section

Some content with code blocks:

```bash
echo "Hello World"
```


2. Push to GitHub - the workflow will automatically run and deploy

---

## Customization (Optional)

### Change Site Title

By default, the site uses your repo name as the title. To customize:

1. Edit frontend/index.html - change the <title> tag

2. Commit and push

### Use Custom Base Path

The site automatically detects your repo name. If you want to override:

1. Edit frontend/vite.config.ts - change repoName variable

2. Edit frontend/src/App.tsx - change default fallback

### Customize RSS Feed

The RSS feed title and description are hardcoded in the backend. To change them:

1. Edit backend/scripts/generate-rss.ts

2. Modify the `SITE_TITLE` and `SITE_DESCRIPTION` constants at the top of the file

3. Commit and push to trigger a rebuild

---

## Architecture

### Build Process

1. **Fetch GitHub Repositories** (via GitHub API)
   - Automatically detects your GitHub username

   - Extracts tags, stars, language, description

   - Generates projects.json

2. **Parse Markdown Posts**

   - Reads all .md files from backend/content/posts/

   - Parses YAML frontmatter (title, date, tags, excerpt)

   - Calculates reading time

   - Generates posts.json

3. **Build Frontend**

   - Copies JSON files to dist
   
   - Builds React app with Vite (auto-detects repo name)

4. **Deploy**

   - GitHub Actions deploys to GitHub Pages

### Search & Filtering

- **SearchDialog** (Cmd+K): Search posts, projects, or filter by tag

- **Projects Page**: Filter repos by tag

- **Blog Page**: Filter posts by tag

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI

- **Backend**: Node.js, TypeScript, gray-matter

- **Deployment**: GitHub Actions -> GitHub Pages

---

## License & Attribution

This project is licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) license.

You are free to use, share, copy, modify, and redistribute this material for any purpose (including commercial use), provided that proper attribution is given.

### Attribution requirements

Any reuse, redistribution, or derivative work must include:

1. The creator's name: HelixCipher
2. A link to the original repository:  
   https://github.com/HelixCipher/pages
3. An indication of whether changes were made
4. A reference to the license (CC BY 4.0)

#### Example Attribution

This work is based on HelixCipher Pages by HelixCipher.  
Original source: https://github.com/HelixCipher/pages
Licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0).

You may place this attribution in a README, documentation, credits section, or other visible location appropriate to the medium.

Full license text: https://creativecommons.org/licenses/by/4.0/


---

## Disclaimer

This project is provided "as-is". The author accepts no responsibility for how this material is used. There is no warranty or guarantee that the scripts are safe, secure, or appropriate for any particular purpose. Use at your own risk.

see [DISCLAIMER.md](./DISCLAIMER.md) for full terms. Use at your own risk.