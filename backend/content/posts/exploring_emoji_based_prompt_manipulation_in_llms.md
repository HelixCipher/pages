---
title: "Exploring Emoji-Based Prompt Manipulation in LLMs"
date: "2026-04-19"
excerpt: "Exploring Emoji-Based Prompt Manipulation in LLMs"
tags: ["ai", "aiattacks", "adversarialml", "cybersecurity"]
---

Researchers tested 50 emoji-augmented prompts across four open-source LLMs (Mistral 7B, Qwen 2 7B, Gemma 2 9B, Llama 3 8B) and report model-dependent vulnerabilities: some models yielded restricted outputs for a fraction of prompts while others resisted the attacks entirely. The paper shows emoji sequences can alter token/representation boundaries and sometimes bypass prompt-level safety checks.

Why this matters for practitioners:

• Emoji sequences are ubiquitous and often treated as harmless; adversaries can exploit that trust to craft covert jailbreaks.

• Vulnerability is model-specific. Defensive choices (safety judges, filtering logic, tokenization strategy) materially affect resilience.

• Attacks that blend non-textual tokens with natural language can evade keyword filters and some judge-based systems, and may require multimodal or representation-aware defenses.

Practical short checklist:

• Treat emojis and other non-alphanumeric tokens as potential attack surface in red-team exercises.

• Add normalization and semantic checks (not just keyword filters) before passing user content to safety pipelines.

• Include emoji-augmented prompts in safety/regression suites and in model evaluation benchmarks.

• Prefer defense-in-depth: policy-based guards + judge models + runtime monitoring of unusual generation patterns.


## References

https://arxiv.org/html/2601.00936v1