---
title: "When Your Mouse Becomes a Microphone"
date: "2026-04-19"
excerpt: "When Your Mouse Becomes a Microphone"
tags: ["securityresearch", "sidechannel", "privacy", "infosec"]
---


research demonstrates a practical side-channel attack that uses high-performance optical mouse sensors to recover speech from desk vibrations. The Mic-E-Mouse pipeline shows that surface vibrations captured by a mouse collected by user-space software without special privileges can be filtered and reconstructed into intelligible audio, producing measurable SNR gains and nontrivial speech recognition results in controlled tests.

Why it matters: modern consumer mice now sample at kHz rates and ship with increasingly sensitive sensors at low price points, expanding the potential attack surface for stealthy eavesdropping in home and office environments. The attack is stealthy because it can be executed from user-level code and leverages signal-processing plus ML to overcome sampling and quantization limits.

Key technical takeaways:

• Optical sensors detect desk vibrations that correlate with speech, a tailored filtering + ML pipeline can boost SNR and produce recognisable audio.

• Effectiveness depends on polling rate, DPI, surface material and environmental noise, but the researchers report meaningful word-level recognition in test datasets.

• The threat model is realistic for remote work and shared spaces, and the exploit requires rethinking which peripherals are considered sensitive.

Practical implications for teams:

• Treat high-fidelity peripherals as potential sensors in threat models.

• Limit or monitor user-space telemetry collection; enforce kernel-level controls or provenance checks for apps reading high-frequency HID data.

• Consider physical mitigations (surface dampening, device placement) as part of a layered defence.

## References

https://arxiv.org/pdf/2509.13581