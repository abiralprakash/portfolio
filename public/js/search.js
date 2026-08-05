(function () {
  const INDEX_URL = '/js/search-index.json';
  const RELATED_URL = '/js/search-related.json';
  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'product', label: 'Products' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'decision', label: 'Decisions' },
    { id: 'research', label: 'Research' },
    { id: 'thinking', label: 'Thinking' },
    { id: 'pattern', label: 'Patterns' },
  ];

  let index = null;
  let relatedMap = null;
  let panel = null;
  let input = null;
  let results = null;
  let relatedEl = null;
  let filter = 'all';
  let lastFocus = null;

  function ensureUI() {
    if (panel) return;
    panel = document.createElement('div');
    panel.className = 'search-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Search portfolio');
    panel.hidden = true;
    panel.innerHTML =
      '<div class="search-sheet">' +
      '<div class="search-head">' +
      '<label class="eyebrow" for="siteSearch">Search</label>' +
      '<button type="button" class="icon-btn search-close" aria-label="Close search">×</button>' +
      '</div>' +
      '<input id="siteSearch" class="search-input" type="search" placeholder="OCR, Cloudflare, NepalIPMS…" autocomplete="off">' +
      '<div class="search-filters" role="tablist" aria-label="Filter results"></div>' +
      '<ul class="search-results" role="listbox"></ul>' +
      '<div class="search-related" hidden></div>' +
      '<p class="search-hint">Filters · related topics · Ctrl/⌘K</p>' +
      '</div>';
    document.body.appendChild(panel);
    input = panel.querySelector('#siteSearch');
    results = panel.querySelector('.search-results');
    relatedEl = panel.querySelector('.search-related');
    const filtersEl = panel.querySelector('.search-filters');
    filtersEl.innerHTML = FILTERS.map(
      (f) =>
        '<button type="button" data-filter="' +
        f.id +
        '"' +
        (f.id === 'all' ? ' aria-selected="true"' : '') +
        '>' +
        f.label +
        '</button>'
    ).join('');
    filtersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      filter = btn.getAttribute('data-filter');
      filtersEl.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      render(input.value);
    });
    panel.querySelector('.search-close').addEventListener('click', close);
    panel.addEventListener('click', (e) => {
      if (e.target === panel) close();
    });
    input.addEventListener('input', () => render(input.value));
  }

  async function loadIndex() {
    if (index) return index;
    const res = await fetch(INDEX_URL, { credentials: 'omit' });
    index = await res.json();
    return index;
  }

  async function loadRelated() {
    if (relatedMap) return relatedMap;
    try {
      const res = await fetch(RELATED_URL, { credentials: 'omit' });
      relatedMap = await res.json();
    } catch (_) {
      relatedMap = {};
    }
    return relatedMap;
  }

  function score(q, item) {
    const hay = (item.t + ' ' + item.d + ' ' + (item.k || '') + ' ' + (item.c || '')).toLowerCase();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return 0;
    let s = 0;
    for (const term of terms) {
      if (item.t.toLowerCase().includes(term)) s += 5;
      if (hay.includes(term)) s += 2;
      else return 0;
    }
    return s;
  }

  function matchesFilter(item) {
    if (filter === 'all') return true;
    return (item.c || '').toLowerCase() === filter;
  }

  function renderRelated(q) {
    if (!relatedEl || !relatedMap) return;
    const key = Object.keys(relatedMap).find((k) => q.toLowerCase().includes(k));
    if (!key) {
      relatedEl.hidden = true;
      relatedEl.innerHTML = '';
      return;
    }
    const topics = relatedMap[key];
    relatedEl.hidden = false;
    relatedEl.innerHTML =
      '<p class="eyebrow">Related topics</p><ul>' +
      topics
        .map(
          (t) =>
            '<li><a href="' +
            t.u +
            '"><strong>' +
            t.t +
            '</strong><span>' +
            t.d +
            '</span></a></li>'
        )
        .join('') +
      '</ul>';
  }

  function render(q) {
    if (!index || !results) return;
    const trimmed = q.trim();
    if (!trimmed) {
      results.innerHTML = '';
      if (relatedEl) {
        relatedEl.hidden = true;
        relatedEl.innerHTML = '';
      }
      return;
    }
    const hits = index
      .map((item) => ({ item, s: score(trimmed, item) }))
      .filter((x) => x.s > 0 && matchesFilter(x.item))
      .sort((a, b) => b.s - a.s)
      .slice(0, 12);
    if (!hits.length) {
      results.innerHTML = '<li class="search-empty">No matches in this filter — try All, or OCR / Cloudflare.</li>';
    } else {
      results.innerHTML = hits
        .map(
          (h) =>
            '<li><a href="' +
            h.item.u +
            '"><strong>' +
            h.item.t +
            '</strong><span>' +
            (h.item.c ? h.item.c + ' · ' : '') +
            h.item.d +
            '</span></a></li>'
        )
        .join('');
    }
    renderRelated(trimmed);
  }

  function open() {
    ensureUI();
    lastFocus = document.activeElement;
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    Promise.all([loadIndex(), loadRelated()]).then(() => {
      input.focus();
      render(input.value);
    });
  }

  function close() {
    if (!panel) return;
    panel.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', (e) => {
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (panel && !panel.hidden) close();
      else open();
    }
    if (e.key === 'Escape' && panel && !panel.hidden) close();
  });

  function injectButton() {
    const actions = document.querySelector('.nav-actions');
    if (!actions || actions.querySelector('.search-open')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon-btn search-open';
    btn.setAttribute('aria-label', 'Search portfolio');
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>';
    btn.addEventListener('click', open);
    actions.insertBefore(btn, actions.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
