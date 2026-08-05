/**
 * Phase 9 motion layer — entrance, counters, reveals, transitions, reading UX, easter egg.
 * Respects prefers-reduced-motion. GPU-friendly transforms only.
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const isHome = /^\/$|^\/index\.html$/.test(location.pathname);

  /* —— View Transitions (progressive, same-origin only) —— */
  if (!reduced && 'startViewTransition' in document) {
    document.documentElement.classList.add('vt-ready');
    document.addEventListener(
      'click',
      function (e) {
        const a = e.target.closest && e.target.closest('a[href]');
        if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const href = a.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (a.target === '_blank' || a.hasAttribute('download')) return;
        let url;
        try {
          url = new URL(a.href, location.href);
        } catch (err) {
          return;
        }
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.search === location.search) return;
        e.preventDefault();
        document.startViewTransition(function () {
          location.href = url.href;
        });
      },
      true
    );
  }

  /* —— Hero entrance: system coming online —— */
  function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero || !isHome) return;

    hero.classList.add('hero-enter');
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'hero-skip';
    skip.textContent = 'Skip intro';
    skip.setAttribute('aria-label', 'Skip opening animation');
    hero.appendChild(skip);

    function finish() {
      hero.classList.add('hero-ready');
      hero.classList.remove('hero-enter');
      skip.remove();
      root.classList.add('net-active');
    }

    if (reduced || sessionStorage.getItem('heroSkip') === '1') {
      finish();
      return;
    }

    const t = setTimeout(finish, 1400);
    skip.addEventListener('click', function () {
      clearTimeout(t);
      sessionStorage.setItem('heroSkip', '1');
      finish();
    });
  }

  /* —— Number counters (once) —— */
  function initCounters() {
    const nodes = document.querySelectorAll('.numbers-grid .n');
    if (!nodes.length) return;

    function parseTarget(text) {
      const t = text.trim();
      const plus = t.endsWith('+');
      const m = t.match(/^([\d.]+)([KkMm])?/);
      if (!m) return null;
      let n = parseFloat(m[1]);
      if (m[2] === 'K' || m[2] === 'k') n *= 1000;
      if (m[2] === 'M' || m[2] === 'm') n *= 1000000;
      return { n: n, plus: plus, raw: t, isNum: /^\d/.test(t) };
    }

    function format(n, meta) {
      if (meta.raw.match(/[A-Za-z]/) && !meta.raw.match(/^\d/)) return meta.raw;
      if (n >= 1000) {
        const k = n / 1000;
        const s = k % 1 === 0 ? String(k) : k.toFixed(0);
        return s + 'K' + (meta.plus ? '+' : '');
      }
      return Math.round(n) + (meta.plus ? '+' : '');
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          const el = en.target;
          io.unobserve(el);
          const meta = parseTarget(el.textContent);
          if (!meta || !meta.isNum || reduced) return;
          const duration = 900;
          const start = performance.now();
          function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = format(meta.n * eased, meta);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = meta.raw;
          }
          el.textContent = '0';
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  /* —— Image reveal (clip + blur clear) —— */
  function initImageReveals() {
    const imgs = document.querySelectorAll(
      '.work-media img, .featured-media img, .wf-stage img, .demo-media img, .proof-strip img'
    );
    if (!imgs.length) return;
    imgs.forEach(function (img) {
      img.classList.add('media-reveal');
    });
    if (reduced) {
      imgs.forEach(function (img) {
        img.classList.add('is-in');
      });
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    imgs.forEach(function (img) {
      io.observe(img);
    });
  }

  /* —— Work row peek: System / Architecture / Impact —— */
  function initWorkPeek() {
    document.querySelectorAll('.work-row').forEach(function (row) {
      if (row.querySelector('.work-peek')) return;
      const copy = row.querySelector('.work-copy');
      if (!copy) return;
      const peek = document.createElement('div');
      peek.className = 'work-peek';
      peek.setAttribute('aria-hidden', 'true');
      peek.innerHTML = '<span>→ System</span><span>→ Architecture</span><span>→ Impact</span>';
      copy.insertBefore(peek, copy.querySelector('h3') ? copy.querySelector('h3').nextSibling : copy.firstChild);
    });
  }

  /* —— Timeline scroll storytelling —— */
  function initTimelineStory() {
    const steps = document.querySelectorAll('#timeline .story-era');
    if (!steps.length) return;
    if (reduced) {
      steps.forEach(function (s) {
        s.classList.add('in');
      });
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    steps.forEach(function (s) {
      io.observe(s);
    });
  }

  /* —— Reading progress —— */
  function initReadingProgress() {
    const essay = document.querySelector('.wrap.essay') || document.querySelector('main .essay');
    if (!essay) return;
    if (document.querySelector('.read-progress')) return;

    const bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Reading progress');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.innerHTML = '<i></i>';
    document.body.appendChild(bar);

    const fill = bar.querySelector('i');
    const sections = Array.from(document.querySelectorAll('main .section .eyebrow, main h2')).filter(function (el) {
      return !el.closest('.page-hero') && !el.closest('.toc');
    });

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      fill.style.transform = 'scaleX(' + pct / 100 + ')';
      bar.setAttribute('aria-valuenow', String(pct));

      let active = null;
      sections.forEach(function (s) {
        const top = s.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.35) active = s;
      });
      sections.forEach(function (s) {
        s.classList.toggle('section-active', s === active);
      });
      document.querySelectorAll('.toc-links a').forEach(function (a) {
        const href = a.getAttribute('href') || '';
        const id = href.slice(1);
        const target = id && document.getElementById(id);
        a.classList.toggle('is-active', !!(target && target.contains(active)) || (target === active));
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* —— Easter egg: P → Prakash mode —— */
  function initEasterEgg() {
    let armed = true;
    document.addEventListener('keydown', function (e) {
      if (!armed) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== 'p' && e.key !== 'P') return;
      if (document.querySelector('.prakash-mode')) return;

      const panel = document.createElement('div');
      panel.className = 'prakash-mode';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Prakash mode');
      panel.innerHTML =
        '<div class="prakash-sheet">' +
        '<p class="eyebrow">Prakash mode</p>' +
        '<h2>System map</h2>' +
        '<ul class="arch-list">' +
        '<li><strong>Building</strong><span>AI workflow systems · <a class="text-link" href="/now.html">Now</a></span></li>' +
        '<li><strong>Shipped</strong><span>NepalIPMS · OCR · <a class="text-link" href="/proof.html">Proof</a></span></li>' +
        '<li><strong>Thinking</strong><span><a class="text-link" href="/#insights">Insights</a> · <a class="text-link" href="/principles.html">Principles</a></span></li>' +
        '<li><strong>Explore</strong><span><a class="text-link" href="/systems.html">Systems</a> · <a class="text-link" href="/patterns.html">Patterns</a></span></li>' +
        '</ul>' +
        '<pre class="prakash-ascii" aria-hidden="true">·—·—·  systems online  ·—·—·</pre>' +
        '<button type="button" class="btn btn-ghost prakash-close">Close</button>' +
        '</div>';
      document.body.appendChild(panel);
      document.body.style.overflow = 'hidden';
      const closeBtn = panel.querySelector('.prakash-close');
      const focusables = panel.querySelectorAll('a, button');
      const prevFocus = document.activeElement;
      if (closeBtn) closeBtn.focus();

      function close() {
        panel.remove();
        document.body.style.overflow = '';
        if (prevFocus && prevFocus.focus) prevFocus.focus();
      }
      closeBtn.addEventListener('click', close);
      panel.addEventListener('click', function (ev) {
        if (ev.target === panel) close();
      });
      panel.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Tab' || !focusables.length) return;
        const list = Array.prototype.slice.call(focusables);
        const first = list[0];
        const last = list[list.length - 1];
        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        }
      });
      document.addEventListener(
        'keydown',
        function esc(ev) {
          if (ev.key === 'Escape') {
            close();
            document.removeEventListener('keydown', esc);
          }
        }
      );
    });
  }

  /* —— Mobile: mark touch —— */
  if (window.matchMedia('(hover: none)').matches) {
    root.classList.add('is-touch');
  }

  initHero();
  initCounters();
  initImageReveals();
  initWorkPeek();
  initTimelineStory();
  initReadingProgress();
  initEasterEgg();
})();
