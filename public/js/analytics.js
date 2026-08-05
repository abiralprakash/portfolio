/**
 * Privacy-friendly first-party analytics.
 * Tracks path, hash, named events, search queries — no cookies, no IDs, no fingerprinting.
 */
(function () {
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  function send(payload) {
    const body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
        return;
      }
    } catch (_) {}
    fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      credentials: 'omit',
    }).catch(function () {});
  }

  function referrerHost() {
    try {
      return document.referrer ? new URL(document.referrer).host : '';
    } catch (_) {
      return '';
    }
  }

  function pageview() {
    send({
      e: 'pageview',
      p: location.pathname,
      h: location.hash.slice(1),
      r: referrerHost(),
    });
  }

  pageview();
  window.addEventListener('hashchange', pageview);

  // Case / product "completion" — scrolled near bottom once
  if (/\/(case|products)\//.test(location.pathname)) {
    let sent = false;
    window.addEventListener(
      'scroll',
      function () {
        if (sent) return;
        const doc = document.documentElement;
        const scrolled = (window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1);
        if (scrolled > 0.85) {
          sent = true;
          send({
            e: 'content_complete',
            p: location.pathname,
            h: '',
            r: referrerHost(),
          });
        }
      },
      { passive: true }
    );
  }

  document.addEventListener(
    'click',
    function (ev) {
      const a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.indexOf('mailto:hello@prakashadhikari.dev') === 0) {
        send({ e: 'contact_click', p: location.pathname, h: a.className || 'contact', r: referrerHost() });
      } else if (href.indexOf('/case/') === 0) {
        send({ e: 'case_click', p: href.split('#')[0], h: '', r: referrerHost() });
      } else if (href.indexOf('/products/') === 0) {
        send({ e: 'product_click', p: href.split('#')[0], h: '', r: referrerHost() });
      } else if (href.indexOf('/architecture') === 0) {
        send({ e: 'architecture_click', p: href.split('#')[0], h: '', r: referrerHost() });
      } else if (a.classList.contains('btn') && href.indexOf('#contact') !== -1) {
        send({ e: 'contact_button', p: location.pathname, h: 'contact', r: referrerHost() });
      }
    },
    true
  );

  // Search terms (debounced) — query text only, no identity
  document.addEventListener('input', function (ev) {
    const el = ev.target;
    if (!el || el.id !== 'siteSearch') return;
    clearTimeout(el._analyticsTimer);
    el._analyticsTimer = setTimeout(function () {
      const q = (el.value || '').trim().slice(0, 80);
      if (q.length < 2) return;
      send({ e: 'search_query', p: '/search', h: q, r: referrerHost() });
    }, 800);
  });
})();
