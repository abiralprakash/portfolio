/**
 * Living product windows — short, once-on-view animations.
 * Respects prefers-reduced-motion. No infinite loops.
 */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const WINDOWS = {
    search: function (el) {
      const field = document.createElement('div');
      field.className = 'live-overlay live-search';
      field.innerHTML =
        '<span class="live-search-label">Register search</span>' +
        '<div class="live-search-field"><span class="live-type"></span><span class="live-cursor"></span></div>';
      el.appendChild(field);
      const type = field.querySelector('.live-type');
      const text = 'HIMALAYAN';
      let i = 0;
      function tick() {
        if (i <= text.length) {
          type.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, 90);
        } else {
          field.classList.add('live-done');
        }
      }
      setTimeout(tick, 400);
    },
    timeline: function (el) {
      const o = document.createElement('div');
      o.className = 'live-overlay live-timeline';
      o.innerHTML =
        '<span class="live-tl-label">Deadline engine</span>' +
        '<div class="live-tl-track"><i></i></div>' +
        '<div class="live-tl-steps"><span>Filed</span><span>Examination</span><span>Renewal</span></div>';
      el.appendChild(o);
      requestAnimationFrame(function () {
        o.classList.add('live-play');
      });
    },
    notify: function (el) {
      const o = document.createElement('div');
      o.className = 'live-overlay live-notify';
      o.innerHTML =
        '<div class="live-toast"><strong>Renewal</strong><span>Mark due in 14 days</span></div>';
      el.appendChild(o);
      requestAnimationFrame(function () {
        o.classList.add('live-play');
      });
    },
    ocr: function (el) {
      const o = document.createElement('div');
      o.className = 'live-overlay live-ocr';
      o.innerHTML =
        '<span class="live-ocr-label">Extracted fields</span>' +
        '<ul class="live-ocr-fields">' +
        '<li><em>Mark</em><b></b></li>' +
        '<li><em>Class</em><b></b></li>' +
        '<li><em>Applicant</em><b></b></li>' +
        '</ul>';
      el.appendChild(o);
      const vals = ['HIMALAYAN TEA', '30', 'Kathmandu Traders Pvt. Ltd.'];
      const bs = o.querySelectorAll('b');
      vals.forEach(function (v, idx) {
        setTimeout(function () {
          bs[idx].textContent = v;
          bs[idx].classList.add('filled');
          if (idx === vals.length - 1) o.classList.add('live-done');
        }, 500 + idx * 420);
      });
    },
    workflow: function (el) {
      const o = document.createElement('div');
      o.className = 'live-overlay live-workflow';
      o.innerHTML =
        '<div class="live-wf-steps">' +
        '<span data-s="1">Upload</span><span data-s="2">Extract</span><span data-s="3">Review</span><span data-s="4">Merge</span>' +
        '</div>';
      el.appendChild(o);
      let step = 1;
      function advance() {
        o.querySelectorAll('span').forEach(function (s) {
          const n = Number(s.getAttribute('data-s'));
          s.classList.toggle('on', n <= step);
          s.classList.toggle('current', n === step);
        });
        if (step < 4) {
          step++;
          setTimeout(advance, 550);
        } else {
          o.classList.add('live-done');
        }
      }
      setTimeout(advance, 300);
    },
    editorial: function (el) {
      const o = document.createElement('div');
      o.className = 'live-overlay live-editorial';
      o.innerHTML = '<span class="live-ed-line"></span><span class="live-ed-line short"></span><span class="live-ed-line"></span>';
      el.appendChild(o);
      requestAnimationFrame(function () {
        o.classList.add('live-play');
      });
    },
  };

  function wrap(img, kind) {
    if (img.closest('.live-window')) return;
    const win = document.createElement('div');
    win.className = 'live-window';
    win.dataset.live = kind;
    img.parentNode.insertBefore(win, img);
    win.appendChild(img);
    return win;
  }

  const targets = document.querySelectorAll('[data-live]');
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        if (el.classList.contains('live-played')) return;
        el.classList.add('live-played');
        const kind = el.dataset.live;
        if (WINDOWS[kind]) WINDOWS[kind](el);
      });
    },
    { threshold: 0.35 }
  );

  targets.forEach(function (el) {
    io.observe(el);
  });

  /* Auto-wrap featured / work media when data-live-kind on article */
  document.querySelectorAll('[data-live-kind]').forEach(function (article) {
    const kind = article.dataset.liveKind;
    const img = article.querySelector('.featured-media img, .work-media img, .case-hero-media img');
    if (!img || !kind) return;
    const win = wrap(img, kind);
    if (win) io.observe(win);
  });
})();
