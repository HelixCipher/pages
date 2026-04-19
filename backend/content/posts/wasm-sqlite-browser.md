---
title: "Running SQLite in the Browser with WASM"
date: "2026-04-19"
excerpt: "How to use sql.js to run SQLite databases entirely in the browser using WebAssembly."
tags: ["wasm", "sqlite", "javascript"]
---

WebAssembly has unlocked incredible possibilities, including running a full SQLite database entirely in the browser. Let's explore how sql.js makes this possible.

## Setup

```bash
npm install sql.js
```

## Loading a Database

```typescript
import initSqlJs from 'sql.js';

const SQL = await initSqlJs();
const response = await fetch('/database/blog.db');
const buffer = await response.arrayBuffer();
const db = new SQL.Database(new Uint8Array(buffer));

const results = db.exec("SELECT * FROM posts WHERE published = 1");
```

This approach is perfect for static sites where you want database-like querying without a server.