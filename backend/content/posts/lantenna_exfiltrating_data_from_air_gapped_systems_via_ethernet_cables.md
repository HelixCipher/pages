---
title: "LANTENNA — exfiltrating data from air-gapped systems via Ethernet cables"
date: "2026-04-19"
excerpt: "LANTENNA — exfiltrating data from air-gapped systems via Ethernet cables"
tags: ["iotsecurity", "voiceassistant", "cybersecurity", "threatmodeling"]
---

Researchers demonstrate malware modulating Ethernet PHY/cable activity to emit RF signals that a nearby radio can decode. Ordinary wiring can act as an antenna, leaking data from isolated networks without any conventional connection.

Why it matters: air-gapped systems protect high-value assets. LANTENNA shows “no network” ≠ “no exfiltration”: cabling and proximity can defeat perimeter assumptions.

Key takeaways

• Ethernet as antenna — PHY/packet toggling creates RF; SDRs decode it.

• User-level feasibility — runs from ordinary processes or VMs.

• Cable & distance — reception depends on shielding, routing; shielding helps but may not fully stop leakage.

• Receiver — a nearby SDR is enough.

• Mitigations require physical + procedural controls.

Practical steps

• Treat cables/layout as security assets; harden cabling and routing.

• Use Faraday zones or shielded rooms where feasible.

• Control access, monitor for unauthorized radios, run RF sweeps.

• Enforce supply-chain policies, harden hosts, limit privileged execution.

• Red-team EM/cable exfiltration scenarios.


## References

https://arxiv.org/pdf/2110.00104