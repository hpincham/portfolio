async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) return [];
  return res.json();
}

function el(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function renderProjects(projects) {
  const root = document.getElementById('projects');
  root.innerHTML = '';
  projects.forEach(p => {
    const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    const linkOpen = p.link ? `<a href="${p.link}" target="_blank" rel="noopener">` : '';
    const linkClose = p.link ? `</a>` : '';
    root.appendChild(el(`
      <article class="project">
        ${linkOpen}<h3>${p.title}</h3>${linkClose}
        <p>${p.summary || ''}</p>
        <div class="tags">${tags}</div>
      </article>
    `));
  });
}

function renderList(items, rootId) {
  const root = document.getElementById(rootId);
  root.innerHTML = '';
  items.forEach(i => {
    const date = i.date ? ` · ${i.date}` : '';
    root.appendChild(el(`
      <div class="item">
        <a href="${i.link}" target="_blank" rel="noopener">${i.title}</a>
        <div class="sub">${i.source || ''}${date}</div>
      </div>
    `));
  });
}

(async function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  const [projects, posts, talks, site] = await Promise.all([
    loadJSON('data/projects.json'),
    loadJSON('data/writing.json'),
    loadJSON('data/speaking.json'),
    loadJSON('data/site.json'),
  ]);
  renderProjects(projects);
  renderList(posts, 'posts');
  renderList(talks, 'talks');
  const writingMore = document.getElementById('writing-more');
  if (site?.writingHome) writingMore.href = site.writingHome;
})();