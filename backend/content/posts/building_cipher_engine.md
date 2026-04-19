---
title: "Building a Cipher Engine from Scratch"
date: "2026-04-19"
excerpt: "Exploring the fundamentals of encryption by building a substitution cipher engine in TypeScript."
tags: ["cryptography", "typescript", "security"]
---

In this post, we'll explore how to build a simple substitution cipher engine using TypeScript. Ciphers have been used for centuries to protect information, and understanding their mechanics is fundamental to modern cryptography.

## The Basics

A substitution cipher replaces each letter in the plaintext with a corresponding letter from a shuffled alphabet. While easily broken by frequency analysis, it demonstrates core encryption concepts.

```typescript
function encrypt(text: string, key: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return text.split('').map(char => {
    const idx = alphabet.indexOf(char.toUpperCase());
    return idx >= 0 ? key[idx] : char;
  }).join('');
}
```

## Moving Forward

From here, you can explore polyalphabetic ciphers like Vigenère, or dive into modern symmetric encryption with AES. The journey from Caesar to quantum-resistant algorithms is a fascinating one.