/**
 * Product relationship map — ecosystem reveal + signature Explore mode.
 */
(function () {
  const root = document.querySelector('[data-product-map]');
  if (!root) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = Array.from(root.querySelectorAll('[data-map-id]'));
  const detail = root.querySelector('[data-map-detail]');
  if (!nodes.length || !detail) return;

  const titleEl = detail.querySelector('[data-map-title]');
  const catEl = detail.querySelector('[data-map-cat]');
  const techEl = detail.querySelector('[data-map-tech]');
  const relatedEl = detail.querySelector('[data-map-related]');
  const linkEl = detail.querySelector('[data-map-link]');
  const leadEl = detail.querySelector('[data-map-lead]');
  let ecoEl = detail.querySelector('[data-map-eco]');
  if (!ecoEl) {
    ecoEl = document.createElement('div');
    ecoEl.className = 'pmap-eco';
    ecoEl.setAttribute('data-map-eco', '');
    ecoEl.hidden = true;
    detail.appendChild(ecoEl);
  }

  /* Connected graph — ids match data-map-id */
  const GRAPH = {
    nepalipms: {
      nodes: ['legal', 'ocr', 'automation', 'documents', 'ai'],
      eco: [
        { label: 'Architecture', href: '/architecture.html' },
        { label: 'Engineering', href: '/engineering/building-nepalipms-production.html' },
        { label: 'Decisions', href: '/decisions.html' },
        { label: 'Research', href: '/research/ai-document-intelligence-legal.html' },
        { label: 'Patterns', href: '/patterns.html#workflow-automation' },
        { label: 'Case study', href: '/case/nepal-ipms.html' },
      ],
    },
    ocr: {
      nodes: ['nepalipms', 'documents', 'ai', 'automation'],
      eco: [
        { label: 'OCR pipeline', href: '/architecture.html#ocr' },
        { label: 'Engineering', href: '/engineering/designing-ocr-pipelines.html' },
        { label: 'Research', href: '/research/ai-document-intelligence-legal.html' },
        { label: 'Pattern', href: '/patterns.html#document-intelligence' },
        { label: 'Case study', href: '/case/ai-ocr-engine.html' },
        { label: 'Parent product', href: '/products/nepal-ipms.html' },
      ],
    },
    scholarquest: {
      nodes: ['education'],
      eco: [
        { label: 'Case study', href: '/case/scholarquest.html' },
        { label: 'Product', href: '/products/scholarquest.html' },
      ],
    },
    legal: { nodes: ['nepalipms', 'ocr', 'documents'], eco: [] },
    ai: { nodes: ['ocr', 'nepalipms', 'automation'], eco: [{ label: 'Lab', href: '/lab.html' }] },
    automation: { nodes: ['nepalipms', 'ocr', 'ai'], eco: [{ label: 'Now', href: '/now.html' }] },
    documents: { nodes: ['ocr', 'nepalipms'], eco: [{ label: 'Pipeline', href: '/architecture.html#ocr' }] },
    education: { nodes: ['scholarquest'], eco: [] },
  };

  function setEcosystem(id) {
    const g = GRAPH[id];
    if (!g || !g.eco.length) {
      ecoEl.hidden = true;
      ecoEl.innerHTML = '';
      return;
    }
    ecoEl.hidden = false;
    ecoEl.innerHTML =
      '<p class="pmap-eco-label">Connected knowledge</p><ul>' +
      g.eco
        .map(function (e) {
          return '<li><a class="text-link" href="' + e.href + '">' + e.label + '</a></li>';
        })
        .join('') +
      '</ul>';
  }

  function illuminate(id) {
    const g = GRAPH[id];
    const connected = g ? g.nodes.concat([id]) : [id];
    nodes.forEach(function (n) {
      const nid = n.dataset.mapId;
      const on = connected.indexOf(nid) >= 0;
      n.classList.toggle('is-lit', on);
      n.classList.toggle('is-dim', !on);
      n.classList.toggle('is-focus', nid === id);
    });
    root.querySelectorAll('.pmap-link').forEach(function (link, i) {
      link.classList.toggle('is-pulse', !!g);
    });
    setEcosystem(id);
  }

  function clearLight() {
    if (document.body.classList.contains('explore-mode')) return;
    nodes.forEach(function (n) {
      n.classList.remove('is-lit', 'is-dim', 'is-focus', 'is-hot');
    });
    root.querySelectorAll('.pmap-link').forEach(function (l) {
      l.classList.remove('is-pulse');
    });
  }

  function activate(btn) {
    nodes.forEach(function (n) {
      n.setAttribute('aria-pressed', 'false');
    });
    btn.setAttribute('aria-pressed', 'true');
    if (titleEl) titleEl.textContent = btn.dataset.title || btn.textContent.trim();
    if (leadEl) leadEl.textContent = btn.dataset.lead || '';
    if (catEl) catEl.textContent = btn.dataset.cat || '';
    if (techEl) techEl.textContent = btn.dataset.tech || '';
    if (relatedEl) relatedEl.textContent = btn.dataset.related || '';
    if (linkEl) {
      const href = btn.dataset.href || '#';
      linkEl.href = href;
      linkEl.hidden = !btn.dataset.href;
      linkEl.textContent = btn.dataset.linkLabel || 'Open project';
    }
    illuminate(btn.dataset.mapId);
  }

  nodes.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activate(btn);
    });
    btn.addEventListener('mouseenter', function () {
      if (window.matchMedia('(hover: hover)').matches) {
        nodes.forEach(function (n) {
          n.classList.toggle('is-hot', n === btn);
        });
        activate(btn);
      }
    });
    btn.addEventListener('mouseleave', function () {
      btn.classList.remove('is-hot');
      if (!document.body.classList.contains('explore-mode')) {
        /* keep last activation lit lightly */
      }
    });
  });

  const canvas = root.querySelector('.pmap-canvas');
  if (canvas && !reduced) {
    canvas.addEventListener('pointermove', function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      canvas.style.setProperty('--mx', x + '%');
      canvas.style.setProperty('--my', y + '%');
    });
  }

  /* —— Signature Explore mode —— */
  let exploreShell = null;

  function openExplore(focusId) {
    document.body.classList.add('explore-mode');
    const mapSection = document.getElementById('map');
    if (mapSection) {
      mapSection.classList.add('explore-stage');
      mapSection.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
    if (!exploreShell) {
      exploreShell = document.createElement('div');
      exploreShell.className = 'explore-chrome';
      exploreShell.innerHTML =
        '<p class="eyebrow">Body of work</p>' +
        '<p class="explore-hint">Click a product — connected architecture, engineering, research, and decisions light up. Esc to leave.</p>' +
        '<button type="button" class="btn btn-ghost explore-close">Close map</button>';
      const stage = mapSection && mapSection.querySelector('.wrap');
      if (stage) stage.insertBefore(exploreShell, stage.firstChild);
      exploreShell.querySelector('.explore-close').addEventListener('click', closeExplore);
    }
    exploreShell.hidden = false;
    const focus =
      root.querySelector('[data-map-id="' + (focusId || 'nepalipms') + '"]') ||
      root.querySelector('[data-map-id="nepalipms"]') ||
      nodes[0];
    if (focus) activate(focus);
  }

  function closeExplore() {
    document.body.classList.remove('explore-mode');
    const mapSection = document.getElementById('map');
    if (mapSection) mapSection.classList.remove('explore-stage');
    if (exploreShell) exploreShell.hidden = true;
    clearLight();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('explore-mode')) closeExplore();
  });

  document.querySelectorAll('[data-explore-open]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openExplore(el.dataset.exploreFocus || 'nepalipms');
    });
  });

  if (location.hash === '#explore' || location.hash === '#map-explore') {
    setTimeout(function () {
      openExplore('nepalipms');
    }, 200);
  }

  const initial = root.querySelector('[data-map-id="nepalipms"]') || nodes[0];
  activate(initial);
  if (!document.body.classList.contains('explore-mode')) {
    /* Soft default — dim less on first paint */
    nodes.forEach(function (n) {
      n.classList.remove('is-dim');
    });
  }
})();
