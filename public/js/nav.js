(function () {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const links = [
    { href: '/#featured', label: 'Work', match: /^\/$|^\/index\.html$/, section: 'featured' },
    { href: '/products/', label: 'Products', match: /\/products\// },
    { href: '/start.html', label: 'Start', match: /start\.html$/ },
    { href: '/now.html', label: 'Now', match: /now\.html$/ },
    { href: '/lab.html', label: 'Lab', match: /lab\.html$/ },
    {
      href: '/how-i-build.html',
      label: 'Process',
      match: /how-i-build\.html$|artifacts\.html$/,
    },
    {
      href: '/engineering/',
      label: 'Writing',
      match: /\/(engineering|learned|thinking|journal|research|teardowns|founder-notes|reports)\//,
    },
    { href: '/proof.html', label: 'Proof', match: /proof\.html$|evidence\.html$/ },
    { href: '/profile.html', label: 'Profile', match: /profile\.html$|about\.html$/ },
    { href: '/contact.html', label: 'Contact', match: /contact\.html$/ },
  ];

  const nav = document.querySelector('nav.nav-links');
  if (!nav) return;

  function isActive(link) {
    if (!link.match) return false;
    return link.match.test(path);
  }

  nav.id = nav.id || 'primary-nav';
  nav.innerHTML = links
    .map(function (l) {
      const active = isActive(l) ? ' aria-current="page"' : '';
      return '<a href="' + l.href + '"' + active + '>' + l.label + '</a>';
    })
    .join('');

  /* Prefetch destination on hover / focus — feels instant */
  const seen = Object.create(null);
  function warm(href) {
    if (!href || href.charAt(0) === '#') return;
    try {
      const u = new URL(href, location.href);
      if (u.origin !== location.origin || seen[u.pathname]) return;
      seen[u.pathname] = true;
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = u.pathname;
      l.as = 'document';
      document.head.appendChild(l);
    } catch (e) {}
  }
  nav.querySelectorAll('a[href]').forEach(function (a) {
    a.addEventListener('pointerenter', function () {
      warm(a.getAttribute('href'));
    });
    a.addEventListener('focus', function () {
      warm(a.getAttribute('href'));
    });
  });

  const header = document.querySelector('header.nav');
  const actions = header && header.querySelector('.nav-actions');
  if (header && actions && !header.querySelector('.nav-toggle')) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.innerHTML = '<span class="nav-toggle-bars" aria-hidden="true"></span>';
    actions.insertBefore(toggle, actions.firstChild);

    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.hidden = true;
      document.body.appendChild(backdrop);
    }

    function setOpen(open) {
      document.body.classList.toggle('nav-open', open);
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      backdrop.hidden = !open;
      if (open) {
        const first = nav.querySelector('a');
        if (first) first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });
    backdrop.addEventListener('click', function () {
      setOpen(false);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* Scrolled nav shadow */
  if (header) {
    const onScrollChrome = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScrollChrome, { passive: true });
    onScrollChrome();
  }

  /* Homepage section highlighting for Work */
  const isHome = /^\/$|^\/index\.html$/.test(path);
  if (isHome) {
    const workLink = nav.querySelector('a[href="/#featured"]');
    const sections = ['featured', 'work', 'insights', 'assistant', 'ask', 'contact']
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    function syncSection() {
      let current = null;
      const y = window.innerHeight * 0.28;
      sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= y) current = sec.id;
      });
      nav.querySelectorAll('a').forEach(function (a) {
        const href = a.getAttribute('href') || '';
        const hash = href.indexOf('#') >= 0 ? href.split('#')[1] : '';
        const on = hash && hash === current;
        a.classList.toggle('is-active', !!on);
        if (a === workLink) {
          if (current === 'featured' || current === 'work') {
            a.classList.add('is-active');
          }
        }
      });
    }
    window.addEventListener('scroll', syncSection, { passive: true });
    syncSection();
  }
})();
