# ClaruSigna Conversational System – Operations Guide

This document describes how to operate, maintain, and safely evolve the ClaruSigna conversational system.

It is written for maintainers, not end users.

---

## Deployment Model

The system is intentionally split into independently deployable parts:

- **Static site**  
  Deployed via GitHub Pages on push to the site repository.

- **Cloudflare Worker**  
  Deployed manually or via automation using `wrangler deploy`.

- **Knowledge content**  
  Uploaded to Cloudflare R2 and indexed by AI Search.

A failure or update in one area does not require redeploying the others.

---

## Updating Knowledge Content

To add or update knowledge:

1. Upload Markdown or PDF files to the Cloudflare R2 bucket
2. Use consistent prefixes (e.g. `clarusigna/ABOUT.md`)
3. Confirm AI Search indexing completes successfully
4. Use debug mode to verify retrieval

No frontend or Worker changes are required for content-only updates.

**Important:**  
Renaming or deleting objects can silently break retrieval. Treat R2 keys as stable identifiers.

---

## Updating Prompts and Guardrails

System behavior is primarily controlled by the system prompt applied in the Worker.

When updating prompts:
1. Make the change in Worker code (or KV if externalized)
2. Deploy the Worker
3. Test with debug mode enabled
4. Verify:
   - No hallucination
   - Correct refusal behavior
   - Expected tone and scope

Prompt changes should be treated like code changes, not content edits.

---

## Debug Mode

Debug mode is designed for development and diagnostics only.

When enabled, responses include:
- Retrieved filenames
- Similarity scores
- Chunk sizes (length only)
- Redacted retrieval metadata

Debug mode **never** exposes document text.

Ensure debug mode:
- Is not enabled by default
- Is not accessible to anonymous end users

---

## Common Failure Modes

### Chat UI loads but responses fail
- Worker may be unavailable or rejecting requests
- Check CORS allow-list and request method

### Responses seem unrelated or missing
- AI Search indexing may be incomplete
- Confirm files exist in R2 and appear in debug retrieval results

### Frontend changes don’t appear
- Browser caching is likely masking updates
- Perform a hard reload

### Debug output appears in production
- Debug flag is being set unintentionally
- Remove or gate debug logic immediately

---

## Logs and Observability

Use the Cloudflare dashboard to inspect:
- Worker request logs
- Error rates
- AI Search indexing and job logs

There is no state to recover. Most issues are resolved by correcting configuration and redeploying.

---

## Security and Access Notes

- Secrets are stored in Cloudflare bindings, not in source control
- The Worker is the only component allowed to call AI services
- The frontend is considered untrusted input
- Document content must never be sent to the browser

Formal security hardening (CSP, rate limits) is planned but not yet implemented.

---

## Planned Enhancements (Deferred)

- Search relevance tuning and reranking
- Confidence thresholds for refusal responses
- Accessibility improvements
- Abuse and rate limiting
- Role-based prompt profiles

These are intentionally deferred to preserve architectural clarity.

---

## Operating Philosophy

This system is designed to be:
- understandable at a glance
- safe by default
- boring to operate

If maintenance feels exciting, something is probably wrong.
