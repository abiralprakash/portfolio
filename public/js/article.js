/**
 * Article enhancements: reading time, TOC, published/updated meta.
 */
(function () {
  const essay = document.querySelector('.wrap.essay') || document.querySelector('main .essay');
  if (!essay) return;

  const proseRoot = essay.closest('.section') || essay;
  const text = proseRoot.innerText || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));

  const hero = document.querySelector('.page-hero .wrap');
  if (hero && !hero.querySelector('.article-meta')) {
    const meta = document.createElement('p');
    meta.className = 'article-meta meta';
    const published = document.body.dataset.published || '';
    const updated = document.body.dataset.updated;
    let line = minutes + ' min read';
    if (published) line += ' · Published ' + published;
    if (updated) line += ' · Updated ' + updated;
    meta.textContent = line;
    hero.appendChild(meta);
  }

  if (document.querySelector('.toc')) return;

  const eyebrows = Array.from(proseRoot.querySelectorAll('.eyebrow')).filter((e) => !e.closest('.page-hero'));
  const h2s = Array.from(proseRoot.querySelectorAll('h2'));

  let items = [];
  if (eyebrows.length >= 3) {
    items = eyebrows.map((eb, i) => {
      const id = 'sec-' + i;
      const block = eb.closest('div') || eb.parentElement;
      if (block && !block.id) block.id = id;
      return { href: '#' + (block ? block.id : id), label: eb.textContent.trim() };
    });
  } else if (h2s.length >= 3) {
    items = h2s.map((h, i) => {
      if (!h.id) {
        h.id =
          h.textContent
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') || 'section-' + i;
      }
      return { href: '#' + h.id, label: h.textContent.trim() };
    });
  }

  if (items.length < 3) return;

  const toc = document.createElement('nav');
  toc.className = 'toc reveal';
  toc.setAttribute('aria-label', 'On this page');
  toc.innerHTML =
    '<p class="eyebrow">On this page</p><div class="toc-links">' +
    items.map((it) => '<a href="' + it.href + '">' + it.label + '</a>').join('') +
    '</div>';
  essay.insertBefore(toc, essay.firstChild);
})();

