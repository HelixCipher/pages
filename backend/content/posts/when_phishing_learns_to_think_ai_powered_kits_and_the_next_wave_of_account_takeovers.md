---
title: "When Phishing Learns to Think: AI-Powered Kits and the Next Wave of Account Takeovers"
date: "2026-04-19"
excerpt: "When Phishing Learns to Think: AI-Powered Kits and the Next Wave of Account Takeovers"
tags: ["cybersecurity", "phishing", "mfa", "threatintel"]
---

Security researchers have documented a wave of advanced phishing kits named BlackForce, GhostFrame, InboxPrime AI and Spiderman that combine traditional phishing techniques with new automation and evasion features. BlackForce has been tied to Man-in-the-Browser (MitB) flows that capture one-time passwords and bypass multi-factor authentication; it’s reportedly sold on Telegram for a few hundred euros and has been used to impersonate multiple consumer brands.

GhostFrame uses an iframe architecture and random subdomains to hide the active phishing content behind an apparently benign page, improving stealth and making detection harder for some scanners. InboxPrime AI automates large-scale mailing campaigns with AI-generated, human-like emails and built-in spam diagnostics to maximize deliverability. 

Spiderman offers modular, bank-specific replicas and workflows designed to harvest credentials, OTPs and even crypto seed phrases. The reporting highlights operational trends: kits are modular, sold via messaging platforms, and adopt evasion techniques (cache-busting scripts, bot-filtering, geofencing, ISP allow-listing) that reduce detection and complicate blocking rules. Attackers can chain components to complete account compromise and fraud at scale. 

Practical implications for defenders noted in the article include: prioritizing phishing-resistant MFA (hardware keys or platform MFA), hardening email filtering and sender authentication, applying browser and ad-block mitigations, training users to recognise sophisticated lures, and monitoring for atypical authentication patterns and session anomalies. The piece also underscores how automation and AI lower the operational barriers for large, professionalized phishing campaigns.


## References

https://thehackernews.com/2025/12/new-advanced-phishing-kits-use-ai-and.html