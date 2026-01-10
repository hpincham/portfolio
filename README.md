# ClaruSigna Conversational System

This repository contains the backend implementation of the **ClaruSigna conversational assistant**, a production-ready AI system designed to help others understand the professional work, technical depth, and implementation mindset of Howard Pincham.

The system is intentionally minimal, grounded, and transparent in operation, prioritizing accuracy and clarity over breadth or speculation.

---

## What This System Does

- Provides a chat-based interface for exploring ClaruSigna and Howard Pincham’s work
- Grounds responses using curated Markdown and PDF documents
- Prevents hallucination by restricting answers to indexed content only
- Separates public-facing UI from backend AI orchestration
- Supports a safe, developer-only debug mode for observability

This is **not** a generic chatbot or a resume replacement. It is a focused companion that reveals how Howard thinks, builds, and applies technology.

---

## High-Level Architecture

The system consists of four main layers:

1. **Static Website (GitHub Pages)**
   - Hosts the UI and chat interface
   - Collects user input and sends requests to the backend

2. **Cloudflare Worker (this repo)**
   - Acts as a secure API boundary
   - Enforces CORS and request validation
   - Applies system prompts and guardrails
   - Calls Cloudflare AI Search

3. **Cloudflare AI Search (AutoRAG)**
   - Performs vector search and response synthesis
   - Grounds answers using indexed documents only

4. **Cloudflare R2**
   - Stores the authoritative Markdown and PDF knowledge base

Two diagrams in `/docs/diagrams` illustrate:
- Component locations and boundaries
- Runtime request and retrieval flow

---

## Design Principles

- **Grounded by default** – No document, no answer
- **Minimal surface area** – Few moving parts, clear boundaries
- **Separation of concerns** – UI, backend, retrieval, and storage are decoupled
- **Operational clarity** – Easy to understand, debug, and maintain

---

## What This Repo Contains

- Cloudflare Worker source code
- Wrangler configuration
- System prompt and guardrails
- Internal documentation and diagrams

It does **not** contain:
- Front-end site code
- Knowledge documents themselves
- Secrets or API keys

---

## Status

**Production in use**  
Stable and actively serving traffic via `clarusigna.com`
