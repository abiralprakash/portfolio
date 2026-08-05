(function () {
  const bar = document.querySelector('.cat-bar');
  const items = document.querySelectorAll('.explorer-item');
  if (!bar || !items.length) return;

  const buttons = bar.querySelectorAll('button[data-cat]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let viz = bar.parentElement.querySelector('.explorer-viz');
  if (!viz) {
    viz = document.createElement('div');
    viz.className = 'explorer-viz';
    viz.setAttribute('aria-hidden', 'true');
    bar.insertAdjacentElement('afterend', viz);
  }

  const VIZ = {
    ai: '<span class="ev-node">●</span><span class="ev-line"></span><span class="ev-node">◆</span><span class="ev-line"></span><span class="ev-node">●</span><span class="ev-label">retrieve → review → act</span>',
    legal: '<span class="ev-node">▣</span><span class="ev-line"></span><span class="ev-node">▣</span><span class="ev-line"></span><span class="ev-node">▣</span><span class="ev-label">matter → deadline → document</span>',
    edu: '<span class="ev-node">○</span><span class="ev-line"></span><span class="ev-node">○</span><span class="ev-line"></span><span class="ev-node">●</span><span class="ev-label">explore → prepare → inquire</span>',
    saas: '<span class="ev-node">●</span><span class="ev-line"></span><span class="ev-node">●</span><span class="ev-line"></span><span class="ev-node">●</span><span class="ev-label">edge → data → product</span>',
    community: '<span class="ev-node">○</span><span class="ev-line"></span><span class="ev-node">●</span><span class="ev-line"></span><span class="ev-node">○</span><span class="ev-label">profile → trust → engage</span>',
    automation: '<span class="ev-node">▷</span><span class="ev-line"></span><span class="ev-node">◇</span><span class="ev-line"></span><span class="ev-node">■</span><span class="ev-label">trigger → decide → act</span>',
  };

  function showViz(cat) {
    if (reduced) {
      viz.hidden = true;
      return;
    }
    viz.innerHTML = VIZ[cat] || '';
    viz.hidden = !VIZ[cat];
    viz.dataset.cat = cat || '';
  }

  function show(cat) {
    buttons.forEach((btn) => {
      const on = btn.dataset.cat === cat;
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    items.forEach((item) => {
      const cats = (item.dataset.cats || '').split(/\s+/);
      item.classList.toggle('active', cats.includes(cat));
    });
    showViz(cat);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => show(btn.dataset.cat));
    btn.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) showViz(btn.dataset.cat);
    });
  });

  /* Soft ecosystem cue — related writing appears beside active items */
  items.forEach((item) => {
    const h = item.querySelector('h3');
    if (!h || item.querySelector('.ex-eco')) return;
    const title = (h.textContent || '').toLowerCase();
    let links = '';
    if (title.indexOf('ocr') >= 0) {
      links =
        '<a class="text-link" href="/engineering/designing-ocr-pipelines.html">Engineering</a> · <a class="text-link" href="/research/ai-document-intelligence-legal.html">Research</a> · <a class="text-link" href="/architecture.html#ocr">Architecture</a>';
    } else if (title.indexOf('nepal') >= 0 || title.indexOf('ipms') >= 0) {
      links =
        '<a class="text-link" href="/engineering/building-nepalipms-production.html">Engineering</a> · <a class="text-link" href="/decisions.html">Decisions</a> · <a class="text-link" href="/case/nepal-ipms.html">Case study</a>';
    } else if (title.indexOf('global') >= 0) {
      links = '<a class="text-link" href="/case/global-law.html">Case study</a> · <a class="text-link" href="/products/">Products</a>';
    }
    if (!links) return;
    const eco = document.createElement('p');
    eco.className = 'ex-eco';
    eco.innerHTML = '<span class="ex-eco-label">Connected</span> ' + links;
    item.appendChild(eco);
  });

  const initial = bar.querySelector('button[aria-selected="true"]') || buttons[0];
  if (initial) show(initial.dataset.cat);
})();
