---
title: "When light becomes a weapon: laser-based command injection attacks on voice assistants"
date: "2026-04-19"
excerpt: "When light becomes a weapon: laser-based command injection attacks on voice assistants"
tags: ["iotsecurity", "infosec", "threatmodeling", "cybersecurity"]
---


A research introduces LightCommands, a novel class of signal-injection attacks that convert amplitude-modulated light into audio signals at a microphone’s aperture, enabling attackers to inject arbitrary voice commands into popular voice-controllable systems (Alexa, Siri, Google Assistant, Portal) from tens of meters away and through windows/structures. This isn’t science fiction, the team demonstrated control at distances up to ~110 m with commercially available lasers.

Why it matters: voice assistants and smart home devices increasingly control sensitive assets (locks, vehicles, payments, home automation). Light-induced audio injection bypasses traditional acoustic channels and human hearing, enabling remote attackers to issue real commands with zero physical access and no audible evidence from unlocking smart locks to triggering purchases.

Key technical takeaways:

• Physical signal injection via light: MEMS microphones can unintentionally interpret amplitude-modulated light as sound, creating a new channel for command injection beyond audio speakers.

• Extended range & practicality: Using lasers and optics, attackers achieved command injection at distances exceeding 100 m, including through glass.

• Authentication gaps: Many commercial voice systems lack robust user authentication, allowing injected commands to control locks, open garage doors, and even start vehicles linked to the user’s account.

• Cheap setup & stealth: Attacks can be mounted with readily available laser components and tuned to minimize perceptible cues for users.

• Countermeasures discussed: Researchers propose software and hardware defenses to detect and mitigate light-based injection vectors.

Practical implications:

• Threat model revision: include optical signal injection paths when assessing voice-activated device risks.

• Authentication hardening: add multi-factor or liveness checks before executing high-impact commands.

• Sensor filtering & hardware defenses: apply optical filters or signal validation at the microphone interface.

• Physical placement & shielding: position devices to reduce line-of-sight exposure to external light.

## References

https://arxiv.org/pdf/2006.11946