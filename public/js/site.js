(function () {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const isHome = /^\/$|^\/index\.html$/.test(path);
  const isCase = path.indexOf('/case/') === 0;
  const isProduct = path.indexOf('/products/') === 0;

  const scripts = [
    ['/js/analytics.js', true],
    ['/js/search.js', true],
    ['/js/related.js', true],
    ['/js/article.js', true],
    ['/js/motion.js', true],
    ['/js/living.js', isHome || isCase],
    ['/js/freshness.js', true],
    ['/js/context.js', isCase || isProduct || path.indexOf('/research/') === 0],
    ['/js/assistant.js', isHome],
  ];
  scripts.forEach(function (pair) {
    const src = pair[0];
    const load = pair[1];
    if (!load) return;
    if (document.querySelector('script[src="' + src + '"]')) return;
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  });

  /* Subtle load indicator */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const bar = document.createElement('div');
    bar.className = 'page-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    requestAnimationFrame(function () {
      bar.style.transform = 'scaleX(0.65)';
    });
    window.addEventListener('load', function () {
      bar.style.transform = 'scaleX(1)';
      bar.classList.add('is-done');
      setTimeout(function () {
        bar.remove();
      }, 450);
    });
  }

  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') root.classList.add('dark');
  else if (storedTheme === 'light') root.classList.remove('dark');
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      root.classList.toggle('dark');
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduced) {
    revealEls.forEach(function (el) {
      el.classList.add('in');
    });
  } else {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* External link markers + safer rel */
  document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
    const rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') < 0) rel.push('noopener');
    if (rel.indexOf('noreferrer') < 0) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' '));
    if (!a.classList.contains('btn') && !a.closest('.social-links') && !a.classList.contains('icon-btn')) {
      a.classList.add('ext-link');
    }
  });

  /* Copy feedback for code blocks */
  document.querySelectorAll('pre code, .copyable').forEach(function (el) {
    const pre = el.closest('pre') || el;
    if (pre.dataset.copyBound) return;
    pre.dataset.copyBound = '1';
    pre.style.cursor = 'pointer';
    pre.title = 'Click to copy';
    pre.addEventListener('click', function () {
      const text = el.textContent || '';
      if (!navigator.clipboard || !text) return;
      navigator.clipboard.writeText(text).then(function () {
        let toast = document.querySelector('.toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.className = 'toast';
          toast.setAttribute('role', 'status');
          document.body.appendChild(toast);
        }
        toast.textContent = 'Copied';
        toast.classList.add('show');
        setTimeout(function () {
          toast.classList.remove('show');
        }, 1400);
      });
    });
  });

  /* Wrap wide tables for mobile */
  document.querySelectorAll('main table').forEach(function (table) {
    if (table.closest('.table-scroll, .compare-scroll')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-scroll';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const triggers = document.querySelectorAll('.gallery-grid button[data-src]');
    if (!lightboxImg || !triggers.length) return;

    let lastFocus = null;
    const closeBtn = lightbox.querySelector('button, [data-close]') || lightbox;

    function openLightbox(src, alt) {
      lastFocus = document.activeElement;
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn && closeBtn.focus) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.removeAttribute('src');
      document.body.style.overflow = '';
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function openFromHash() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const item = document.getElementById(id);
      const btn = item && item.querySelector('button[data-src]');
      if (btn) openLightbox(btn.dataset.src, btn.dataset.alt || (btn.querySelector('img') && btn.querySelector('img').alt) || '');
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const figure = btn.closest('[id]');
        if (figure && figure.id) history.replaceState(null, '', '#' + figure.id);
        openLightbox(btn.dataset.src, btn.dataset.alt || (btn.querySelector('img') && btn.querySelector('img').alt) || '');
      });
    });

    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  }

  initLightbox();

  /* Prefetch likely next pages on idle hover */
  const prefetched = Object.create(null);
  function prefetch(href) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
    try {
      const u = new URL(href, location.href);
      if (u.origin !== location.origin) return;
      const key = u.pathname;
      if (prefetched[key]) return;
      prefetched[key] = true;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = u.pathname + u.search;
      link.as = 'document';
      document.head.appendChild(link);
    } catch (e) {}
  }
  document.addEventListener(
    'pointerenter',
    function (e) {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      prefetch(a.getAttribute('href'));
    },
    true
  );

  /* Explored pages (session) */
  try {
    const explored = JSON.parse(sessionStorage.getItem('explored') || '[]');
    if (explored.indexOf(path) < 0) {
      explored.push(path);
      sessionStorage.setItem('explored', JSON.stringify(explored.slice(-40)));
    }
    document.querySelectorAll('a[href]').forEach(function (a) {
      try {
        const u = new URL(a.href, location.href);
        const p = u.pathname.replace(/\/$/, '') || '/';
        if (u.origin === location.origin && explored.indexOf(p) >= 0 && p !== path) {
          a.classList.add('is-explored');
        }
      } catch (err) {}
    });
  } catch (e) {}

  /* Build log — mark items newer than last visit */
  try {
    const last = localStorage.getItem('lastVisit');
    const now = String(Date.now());
    document.querySelectorAll('#log .chain-item[data-shipped]').forEach(function (item) {
      const shipped = Date.parse(item.dataset.shipped);
      if (last && shipped && shipped > Number(last)) item.classList.add('is-new');
    });
    localStorage.setItem('lastVisit', now);
  } catch (e) {}

  /* Copy email delight */
  document.querySelectorAll('a[href^="mailto:hello@prakashadhikari.dev"]').forEach(function (a) {
    a.classList.add('copy-email');
    a.addEventListener('click', function (e) {
      if (!navigator.clipboard) return;
      e.preventDefault();
      const email = 'hello@prakashadhikari.dev';
      const label = a.textContent;
      navigator.clipboard.writeText(email).then(function () {
        a.classList.add('is-copied');
        a.textContent = 'Copied ✓';
        setTimeout(function () {
          a.classList.remove('is-copied');
          a.textContent = label;
        }, 1400);
      });
    });
  });

  const SOCIAL = [
    { href: 'https://github.com/abiralprakash', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/abiralprakash/', label: 'LinkedIn' },
    { href: 'https://facebook.com/jptag', label: 'Facebook' },
  ];

  function socialNavHtml() {
    return SOCIAL.map(function (s) {
      return '<a href="' + s.href + '" target="_blank" rel="noopener noreferrer">' + s.label + '</a>';
    }).join('');
  }

  document.querySelectorAll('footer .footer-inner').forEach(function (inner) {
    if (!inner.querySelector('.social-links')) {
      const nav = document.createElement('nav');
      nav.className = 'social-links';
      nav.setAttribute('aria-label', 'Social profiles');
      nav.innerHTML = socialNavHtml();
      const last = inner.lastElementChild;
      if (last) inner.insertBefore(nav, last);
      else inner.appendChild(nav);
    }
    if (!inner.querySelector('.footer-note')) {
      const note = document.createElement('p');
      note.className = 'footer-note';
      note.textContent = 'Open to conversations about AI products, systems, and technology.';
      inner.appendChild(note);
    }
  });

  /* Hero net — pause when offscreen */
  const canvas = document.getElementById('net');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let nodes = [];
  let raf = 0;
  let netBoost = 0;
  let visible = true;
  let heartbeat = 0;
  let lastBeat = performance.now();

  if (!reduced) {
    setTimeout(function () {
      root.classList.add('net-active');
      netBoost = 1;
    }, 220);
  } else {
    root.classList.add('net-active');
    netBoost = 1;
  }

  function getAccent() {
    return getComputedStyle(root).getPropertyValue('--accent').trim() || '#0A3A5C';
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initNodes() {
    nodes = [];
    const count = w < 640 ? 18 : 32;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.3 + 0.85,
      });
    }
  }

  function draw(now) {
    if (!w || !visible) return;
    now = now || performance.now();
    /* Heartbeat every ~26s — soft edge pulse */
    if (!reduced && now - lastBeat > 26000) {
      lastBeat = now;
      heartbeat = 1;
    }
    if (heartbeat > 0) heartbeat = Math.max(0, heartbeat - 0.012);

    ctx.clearRect(0, 0, w, h);
    const accent = getAccent();
    const breath = reduced ? 0 : 0.04 * Math.sin(now / 4200);
    const beatBoost = heartbeat * 0.22;

    nodes.forEach(function (n) {
      if (!reduced) {
        n.x += n.vx * (0.85 + breath);
        n.y += n.vy * (0.85 + breath);
      }
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - d / 130) * (0.07 + 0.18 * netBoost + breath + beatBoost);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 0.32 + 0.38 * netBoost + breath * 0.5 + beatBoost * 0.4;
    nodes.forEach(function (n) {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (1 + beatBoost * 0.35), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (netBoost < 1 && !reduced) netBoost = Math.min(1, netBoost + 0.025);

    if (!reduced && visible) raf = requestAnimationFrame(draw);
  }

  function start() {
    cancelAnimationFrame(raf);
    resize();
    initNodes();
    draw();
  }

  start();
  window.addEventListener('resize', start);

  if ('IntersectionObserver' in window) {
    const netIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible && !reduced) {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(draw);
          } else {
            cancelAnimationFrame(raf);
          }
        });
      },
      { threshold: 0.05 }
    );
    netIo.observe(canvas);
  }

  const themeObserver = new MutationObserver(function () {
    if (reduced) draw();
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
})();
