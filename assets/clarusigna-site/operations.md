# ClaruSigna Conversational System – Operations Guide

This document describes how the ClaruSigna conversational system is operated, maintained, and safely evolved over time.

It is written for future maintainers (primarily Howard) and assumes familiarity with Cloudflare Workers and GitHub-based workflows.

---

## Deployment Model

This system is intentionally split across repositories:

- **Site Repo** (`clarusigna-site`)
  - GitHub Pages
  - Static assets and chat UI
- **Worker Repo** (this repo)
  - Cloudflare Worker
  - AI orchestration and policy enforcement

These two components deploy independently.

---

## Deploying the Worker

From this repository:

```bash
wrangler deploy
