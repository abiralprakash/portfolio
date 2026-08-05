/**
 * Content relationship engine — inject recommendation paths from knowledge-graph.json.
 */
(function () {
  function normalize(p) {
    if (!p) return '/';
    let x = p.replace(/\/index\.html$/, '/');
    if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
    return x;
  }

  async function run() {
    if (document.querySelector('[data-related-manual]')) return;
    let graph;
    try {
      const res = await fetch('/js/knowledge-graph.json', { credentials: 'omit' });
      graph = await res.json();
    } catch (_) {
      return;
    }

    const pathname = normalize(window.location.pathname);
    let entry = graph[window.location.pathname] || graph[pathname] || graph[pathname + '.html'];
    if (!entry) {
      const hit = Object.keys(graph).find((k) => normalize(k) === pathname);
      entry = hit ? graph[hit] : null;
    }
    if (!entry || !entry.links || !entry.links.length) return;

    const section = document.createElement('section');
    section.className = 'section related-section';
    section.setAttribute('aria-label', 'Related paths');
    section.innerHTML =
      '<div class="wrap">' +
      '<div class="section-head">' +
      '<p class="eyebrow">Recommendation path</p>' +
      '<h2>' +
      (entry.title || 'Continue exploring') +
      '</h2>' +
      (entry.lead
        ? '<p class="lede">' + entry.lead + '</p>'
        : '<p class="lede">Related product, decision, pattern, research, and skill — so every page strengthens the ecosystem.</p>') +
      '</div>' +
      '<nav class="related-grid">' +
      entry.links
        .map(function (l) {
          const kind = l.kind ? '<span class="insights-cat">' + l.kind + '</span>' : '';
          return (
            '<a href="' +
            l.href +
            '">' +
            kind +
            '<strong>' +
            l.label +
            '</strong><span>' +
            (l.sub || '') +
            '</span></a>'
          );
        })
        .join('') +
      '</nav></div>';

    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    if (main) main.appendChild(section);
    else if (footer) footer.parentNode.insertBefore(section, footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
