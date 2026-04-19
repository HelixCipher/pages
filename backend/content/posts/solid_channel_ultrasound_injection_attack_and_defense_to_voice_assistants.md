---
title: "Solid-Channel Ultrasound Injection Attack and Defense to Voice Assistants"
date: "2026-04-19"
excerpt: "Solid-Channel Ultrasound Injection Attack and Defense to Voice Assistants"
tags: ["ai", "aiprivacy", "cybersecurity", "acousticadversarial"]
---


Researchers introduce SUAD, a novel inaudible attack that uses piezo transmitters on solid surfaces (e.g., tables) to inject ultrasonic voice commands into nearby devices and an accompanying universal defense that emits inaudible perturbations from the device speaker to block such attacks while preserving legitimate voice use. SUAD demonstrates long-range, cross-barrier activation with median attack success >89.8% and a defense blocking rate >98% in experiments on commercial phones.

Why it matters: voice assistants (Siri, Bixby, etc.) hold sensitive privileges (calls, payments, device controls). Attacks that bypass line-of-sight and work through solids expand the realistic attacker surface, covertly placed piezo devices under furniture can trigger high-impact commands without audible traces. Defenses that disrupt IVAs (inaudible voice attacks) must therefore preserve normal VA UX while reliably neutralizing ultrasonic payloads.

Key technical takeaways:

• Solid-channel dispersion matters. Signals traveling in solids undergo frequency-dependent dispersion that distorts waveforms; SUAD compensates with distance/material-aware command synthesis.

• Adaptive command generation. The attack fuses voiceprint embedding and inverse solid-channel modeling so injected commands survive propagation and can bypass voiceprint checks.

• Low-power, local defense. SUAD Defense trains universal adversarial perturbations (randomized in time/frequency) that the device speaker emits to break ultrasonic commands while leaving normal speech intact.

• High empirical effectiveness. Median activation >89.8% (attack); defense success >98% across tested scenarios and phones.

Practical implications for product/security teams:

• Threat model update: include solid-channel IVAs—assume adversaries can exploit furniture/fixtures in physical environments.

• Design-in mitigations: consider on-device, low-latency perturbation layers or microphone/speaker co-checks that detect solid-channel signatures.

• Physical hygiene: restrict unsupervised access to surfaces near sensitive devices (conference room tables, desks).

• Authentication hardening: combine liveness, multimodal confirmation (e.g., speaker + user presence), and high-assurance voiceprint checks that resist replay/injection.

• Testing & red-teaming: include table/solid-surface injection scenarios in VA robustness suites.

## References

https://arxiv.org/html/2508.02116v1
