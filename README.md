# Howard Portfolio Starter (Static, GitHub Pages Ready)

This is a zero-build static site you can edit in minutes and publish on **GitHub Pages**.  
No Node, no frameworks—just HTML/CSS/JS + JSON content files.

## ✅ What’s inside
- `index.html` — single-page layout with About, Portfolio, Writing, Speaking, Contact
- `styles.css` — modern, accessible, dark theme
- `scripts.js` — renders content from `/data/*.json`
- `/data/projects.json` — your portfolio cards
- `/data/writing.json` — articles/posts (link out to Substack/Notion/blog)
- `/data/speaking.json` — talks and workshops
- `/assets` — drop in `Howard-Pincham-Resume.pdf` and any images
- `LICENSE.txt` — CC BY 4.0 (edit as desired)

## ✏️ Edit your content
Update the JSON files in `/data`:
```json
[
  {
    "title": "Project title",
    "summary": "What you did and why it mattered.",
    "tags": ["LLMOps", "FinOps"],
    "link": "https://your-link"
  }
]
```

## 🚀 Deploy to GitHub Pages (one-time)
1. Create a new public repo on GitHub (e.g., `howard-portfolio`).
2. Upload the contents of `/site` to the repo root.
3. In the repo: **Settings → Pages → Build and deployment → Source = Deploy from a branch**.  
   - Branch: `main` (or `master`)  
   - Folder: `/ (root)`
4. Save. Your site will publish at `https://<your-username>.github.io/<repo>/`.
5. Optional: set a custom domain (e.g., `howardpincham.com`) in **Settings → Pages**.

## 🧰 Daily edits
- Add new projects/posts by updating `/data/*.json` (GitHub web editor works fine).
- Replace the placeholder links, update About, and drop your resume into `/assets/Howard-Pincham-Resume.pdf`.

## 🧱 Alternatives (when you’re ready)
- **Astro/Content Collections** for Markdown posts + fast static builds
- **Next.js on Vercel** for dynamic features, auth, and API routes
- **MkDocs or Docusaurus** if you prefer docs-style navigation

## 📄 License
Default is CC BY 4.0. Change `LICENSE.txt` if you prefer a different license.
