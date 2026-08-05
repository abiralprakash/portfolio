/**
 * Relative "Updated …" labels from data-updated / meta[name=updated].
 * Privacy-friendly — no network calls.
 */
(function () {
  function parseDate(raw) {
    if (!raw) return null;
    const t = Date.parse(raw);
    return Number.isNaN(t) ? null : t;
  }

  function rel(ts) {
    const days = Math.floor((Date.now() - ts) / 86400000);
    if (days < 0) return 'Updated recently';
    if (days === 0) return 'Updated today';
    if (days === 1) return 'Updated yesterday';
    if (days < 14) return 'Updated ' + days + ' days ago';
    if (days < 45) return 'Updated last month';
    const months = Math.floor(days / 30);
    if (months < 12) return 'Updated ' + months + ' month' + (months === 1 ? '' : 's') + ' ago';
    return 'Updated ' + new Date(ts).toLocaleString('en', { month: 'short', year: 'numeric' });
  }

  const meta = document.querySelector('meta[name="updated"]');
  const metaTs = meta ? parseDate(meta.getAttribute('content')) : null;

  document.querySelectorAll('[data-updated], .freshness').forEach(function (el) {
    const ts = parseDate(el.getAttribute('data-updated')) || metaTs;
    if (!ts) return;
    const label = rel(ts);
    if (el.classList.contains('freshness') || el.hasAttribute('data-updated')) {
      el.textContent = label;
      el.setAttribute('title', new Date(ts).toISOString().slice(0, 10));
    }
  });

  document.querySelectorAll('[data-status]').forEach(function (el) {
    const s = el.getAttribute('data-status');
    if (!s) return;
    el.classList.add('status-pill');
    if (s === 'active' || s === 'production') el.classList.add('is-active');
    if (s === 'dev' || s === 'development') el.classList.add('is-dev');
    if (s === 'research' || s === 'evolving') el.classList.add('is-evolving');
  });
})();
