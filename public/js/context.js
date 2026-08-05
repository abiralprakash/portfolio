/**
 * Context-aware recommendations — session-only view history.
 * No cookies, no server storage, no PII. Privacy-friendly.
 */
(function () {
  const KEY = 'pa_ctx_views';
  const MAX = 8;

  function normalize(p) {
    if (!p) return '/';
    let x = p.replace(/\/index\.html$/, '/');
    if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
    return x;
  }

  function load() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || '[]');
    } catch (_) {
      return [];
    }
  }

  function save(list) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    } catch (_) {}
  }

  function topicFromPath(path) {
    const p = normalize(path);
    if (p.indexOf('ocr') !== -1 || p.indexOf('document-intelligence') !== -1)
      return { id: 'ocr', label: 'OCR / document intelligence' };
    if (p.indexOf('nepal-ipms') !== -1 || p.indexOf('nepalipms') !== -1)
      return { id: 'nepalipms', label: 'NepalIPMS' };
    if (p.indexOf('search') !== -1 || p.indexOf('130k') !== -1)
      return { id: 'search', label: 'Search systems' };
    if (p.indexOf('research') !== -1) return { id: 'research', label: 'Research' };
    if (p.indexOf('decision') !== -1) return { id: 'decisions', label: 'Decisions' };
    if (p.indexOf('pattern') !== -1) return { id: 'patterns', label: 'AI patterns' };
    if (p.indexOf('engineering') !== -1) return { id: 'engineering', label: 'Engineering' };
    if (p.indexOf('cloudflare') !== -1 || p.indexOf('stack') !== -1)
      return { id: 'cloudflare', label: 'Cloudflare / stack' };
    return null;
  }

  const SUGGEST = {
    ocr: [
      { t: 'Document Intelligence Research', u: '/research/ai-document-intelligence-legal.html' },
      { t: 'AI Review Pattern', u: '/patterns.html#human-ai-review' },
      { t: 'OCR Architecture', u: '/architecture.html#ocr' },
      { t: 'Decision Log', u: '/decisions.html' },
    ],
    nepalipms: [
      { t: 'Production engineering', u: '/engineering/building-nepalipms-production.html' },
      { t: 'Workflow pattern', u: '/patterns.html#workflow-automation' },
      { t: 'Compare products', u: '/compare.html' },
      { t: 'Founder note', u: '/founder-notes/why-i-built-nepalipms.html' },
    ],
    search: [
      { t: 'Register search research', u: '/research/register-search-accuracy.html' },
      { t: 'Exact matching decision', u: '/decisions.html' },
      { t: 'Search playground', u: '/playground.html#search' },
      { t: 'NepalIPMS', u: '/products/nepal-ipms.html' },
    ],
    research: [
      { t: 'AI patterns', u: '/patterns.html' },
      { t: 'Lab experiments', u: '/lab.html' },
      { t: 'Thinking', u: '/thinking/' },
      { t: 'Roadmap', u: '/roadmap.html' },
    ],
    decisions: [
      { t: 'Engineering notes', u: '/engineering/' },
      { t: 'Stack', u: '/stack.html' },
      { t: 'Principles', u: '/principles.html' },
      { t: 'Architecture', u: '/architecture.html' },
    ],
    patterns: [
      { t: 'OCR product', u: '/products/ocr-engine.html' },
      { t: 'Playground', u: '/playground.html' },
      { t: 'Research', u: '/research/' },
      { t: 'Teardowns', u: '/teardowns/' },
    ],
    engineering: [
      { t: 'Decisions', u: '/decisions.html' },
      { t: 'Diagrams', u: '/diagrams.html' },
      { t: 'Systems', u: '/systems.html' },
      { t: 'Compare', u: '/compare.html' },
    ],
    cloudflare: [
      { t: 'Cloudflare production', u: '/engineering/cloudflare-production.html' },
      { t: 'Why D1', u: '/decisions.html' },
      { t: 'Stack', u: '/stack.html' },
      { t: 'NepalIPMS', u: '/products/nepal-ipms.html' },
    ],
  };

  const path = normalize(location.pathname);
  const topic = topicFromPath(path);
  let views = load();
  if (topic) {
    views = views.filter(function (v) {
      return v.id !== topic.id;
    });
    views.unshift({ id: topic.id, label: topic.label, path: path, t: Date.now() });
    save(views);
  }

  // Show banner from prior topic (not the current page's topic alone)
  const prior = views.find(function (v) {
    return !topic || v.id !== topic.id;
  });
  if (!prior || !SUGGEST[prior.id]) return;

  const links = SUGGEST[prior.id].filter(function (l) {
    return normalize(l.u.split('#')[0]) !== path;
  });
  if (!links.length) return;

  function inject() {
    if (document.querySelector('[data-context-banner]')) return;
    const el = document.createElement('aside');
    el.className = 'context-banner';
    el.setAttribute('data-context-banner', '');
    el.setAttribute('aria-label', 'Because you viewed related work');
    el.innerHTML =
      '<div class="wrap">' +
      '<p class="eyebrow">Because you viewed ' +
      prior.label +
      '</p>' +
      '<p class="context-lead">Explore next:</p>' +
      '<nav class="context-links">' +
      links
        .map(function (l) {
          return '<a class="text-link" href="' + l.u + '">' + l.t + '</a>';
        })
        .join(' · ') +
      '</nav></div>';

    const main = document.querySelector('main');
    const related = document.querySelector('.related-section');
    if (related) related.parentNode.insertBefore(el, related);
    else if (main) main.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(inject, 80);
    });
  } else {
    setTimeout(inject, 80);
  }
})();
