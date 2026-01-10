# ClaruSigna Conversational System

**Milestone Architecture & Operations Record**

**Date:** January 2026
**Status:** Stable, production-in-use
**Scope:** Initial production deployment of the ClaruSigna AI assistant backed by Cloudflare AI Search and curated knowledge content.

---

## 1. Milestone Overview

This milestone establishes the first production-ready version of the **ClaruSigna conversational assistant**, a web-based AI interface designed to help others understand the professional work, technical approach, and implementation mindset of Howard Pincham.

At this stage, the system:

* Serves a static website via GitHub Pages
* Uses a Cloudflare Worker as a secure backend API
* Grounds responses using Cloudflare AI Search (AutoRAG) over curated Markdown and PDF documents stored in Cloudflare R2
* Enforces strict guardrails to avoid hallucination, document leakage, or over-interpretation
* Supports a developer-only debug mode for observability without exposing internal data to end users

### Out of Scope (Intentionally Deferred)

* Advanced search tuning and ranking optimization
* UI display of citations or sources
* Formal security hardening (CSP, rate limits, etc.)
* Accessibility audit and remediation

These are planned future improvements and are intentionally excluded from this milestone.

---

## 2. System at a Glance

The system consists of four major layers:

1. **Client (Browser)** – static site and chat UI
2. **Edge Compute** – Cloudflare Worker acting as API and policy layer
3. **Retrieval & Synthesis** – Cloudflare AI Search (AutoRAG)
4. **Knowledge Storage** – Cloudflare R2 object storage

Two diagrams accompany this document:

* **Diagram 1:** *Architecture – Components & Locations*
  `docs/diagrams/architecture-components.drawio` (exported as PNG/SVG)

* **Diagram 2:** *Runtime Flow – Request, Retrieval, Response*
  `docs/diagrams/runtime-flow.drawio`

These diagrams should be considered the authoritative visual reference for the system.

---

## 3. Component Inventory

### 3.1 Static Website (GitHub Pages)

**Location**

* Repository: `clarusigna-site`
* Hosting: GitHub Pages
* Domain: `https://clarusigna.com`

**Responsibilities**

* Render the public-facing website
* Host the chat UI
* Collect user input and send structured requests to the backend Worker

**Key Files**

* `index.html`
* `styles.css`
* `bot.js`

**Failure Impact**

* If unavailable, users cannot access the site or chat interface
* No data loss; stateless

---

### 3.2 Front-End Chat Logic (`bot.js`)

**Location**

* `clarusigna-site/bot.js`

**Responsibilities**

* Capture user messages
* Maintain message history for context
* POST requests to the Cloudflare Worker endpoint
* Optionally enable debug mode for development

**Notes**

* The front end never calls OpenAI or AI Search directly
* The Worker URL is hard-coded and treated as a trusted backend

**Failure Impact**

* Chat UI becomes non-functional
* Static site still loads

---

### 3.3 Cloudflare Worker (Backend API)

**Location**

* Repository: `clarusigna-bot-worker`
* Deployment target: Cloudflare Workers
* Endpoint: `https://clarusigna-bot-worker.<account>.workers.dev`

**Responsibilities**

* Enforce CORS allow-list (`https://clarusigna.com`)
* Accept only POST requests
* Parse and validate request payloads
* Extract the latest user query
* Apply system prompt and guardrails
* Call Cloudflare AI Search
* Return a minimal `{ text }` response to end users
* Return expanded debug metadata only when explicitly enabled

**Key Characteristics**

* Stateless
* No document text is ever returned to the browser
* Secrets (API keys, bindings) are stored in Cloudflare, not in the repo

**Failure Impact**

* Chat UI fails to respond
* Site remains accessible

---

### 3.4 Cloudflare AI Search (AutoRAG)

**Instance**

* Name: `clarus-search`

**Responsibilities**

* Index Markdown and PDF content stored in R2
* Perform vector similarity search
* Retrieve relevant content chunks
* Synthesize grounded responses

**Notes**

* AI Search is the only component that “sees” document text
* Retrieval metadata (filenames, scores) is returned to the Worker
* Raw content is never exposed beyond this boundary

**Failure Impact**

* Responses may fail or degrade
* No data corruption risk

---

### 3.5 Cloudflare R2 (Knowledge Base)

**Contents**

* Markdown files (e.g. `ABOUT.md`, `GUARDRAILS.md`)
* PDFs containing curated professional material

**Structure**

* Objects are namespaced under prefixes such as:

  * `clarusigna/ABOUT.md`
  * `clarusigna/GUARDRAILS.md`

**Responsibilities**

* Act as the authoritative knowledge store
* Serve as the indexing source for AI Search

**Failure Impact**

* AI Search cannot retrieve grounding content
* Chat responses become unavailable or blocked by guardrails

---

## 4. Data & Knowledge Flow

At runtime, the system behaves as follows:

1. A user submits a question in the browser
2. `bot.js` packages the message history into a JSON payload
3. The payload is POSTed to the Cloudflare Worker
4. The Worker:

   * Validates the request
   * Extracts the most recent user message
   * Applies the system prompt and behavioral constraints
5. The Worker calls:

   ```
   env.AI.autorag("clarus-search").aiSearch(...)
   ```
6. AI Search retrieves the most relevant document chunks from R2
7. AI Search synthesizes a response grounded in those documents
8. The Worker returns:

   * `{ text }` to normal users
   * `{ text, sources, result }` only when debug mode is enabled
9. The browser renders only the response text

At no point does document content cross the Worker → browser boundary.

---

## 5. Configuration & Key Objects

### Stable Identifiers (Do Not Rename Lightly)

* AI Search instance name: `clarus-search`
* R2 object prefixes: `clarusigna/`
* Worker bindings:

  * `AI` (Cloudflare AI platform)
* Worker endpoint URL

Changing these requires coordinated updates and reindexing.

---

## 6. Operating and Maintaining the System (Narrative)

This system is designed to be low-maintenance and low-risk.

### Updating Knowledge Content

When new Markdown or PDF content is added to R2:

* Upload the file under the correct prefix
* Trigger or wait for AI Search reindexing
* Validate via debug mode that the file appears in retrieval results

No frontend or Worker changes are required for content-only updates.

### Updating Prompts or Guardrails

Prompt changes live in the Worker code (or optionally in KV if externalized later).
After updating:

* Deploy the Worker
* Test with debug mode enabled
* Confirm no regression in refusal or hallucination behavior

### Deploying Changes

* Site changes: push to `clarusigna-site`, GitHub Pages rebuilds automatically
* Worker changes: `wrangler deploy` from `clarusigna-bot-worker`

These deployments are independent and intentionally decoupled.

### Debugging

Debug mode is enabled explicitly by the client during development.
It provides:

* Retrieved filenames
* Similarity scores
* Chunk sizes (length only)

It never exposes document text.

---

## 7. Known Risks and Sharp Edges

* Browser caching can mask frontend changes (hard reload required)
* AI Search indexing delays can look like “missing data”
* Renaming R2 keys breaks retrieval silently
* Overly broad prompts can reduce grounding quality
* Debug mode must never be enabled for public users

These risks are known, understood, and accepted for this milestone.

---

## 8. Future Enhancements (Deferred)

The following improvements are planned but intentionally deferred:

* Search relevance tuning and reranking
* Confidence thresholds for “I don’t know” responses
* Security hardening (CSP, rate limiting, abuse prevention)
* Accessibility audit and WCAG remediation
* Role-based prompt profiles

Deferring these allowed the core architecture to stabilize first.

---

## Closing Notes

This milestone represents a clean, understandable, and defensible architecture:

* Minimal surface area
* Clear trust boundaries
* Strong grounding guarantees
* Operational simplicity

Future work should build on this foundation rather than replace it.
