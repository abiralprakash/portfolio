(function () {
  const pipes = document.querySelectorAll('[data-pipe]');
  if (!pipes.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  pipes.forEach((pipe) => {
    const stages = Array.from(pipe.querySelectorAll('[data-stage]'));
    const detail = pipe.querySelector('[data-pipe-detail]');
    if (!stages.length || !detail) return;

    const titleEl = detail.querySelector('[data-pipe-title]');
    const techEl = detail.querySelector('[data-pipe-tech]');
    const reasonEl = detail.querySelector('[data-pipe-reason]');
    const tradeEl = detail.querySelector('[data-pipe-tradeoff]');

    // Document token that travels the flow bar
    let flow = pipe.querySelector('.pipe-flow');
    if (flow && !flow.querySelector('.pipe-token') && !reduced) {
      const token = document.createElement('span');
      token.className = 'pipe-token';
      token.setAttribute('aria-hidden', 'true');
      flow.appendChild(token);
    }
    const token = pipe.querySelector('.pipe-token');

    function activate(btn, index) {
      stages.forEach((s) => s.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      if (titleEl) titleEl.textContent = btn.dataset.title || btn.textContent.trim();
      if (techEl) techEl.textContent = btn.dataset.tech || '';
      if (reasonEl) reasonEl.textContent = btn.dataset.reason || '';
      if (tradeEl) tradeEl.textContent = btn.dataset.tradeoff || '';
      const pct = stages.length <= 1 ? 100 : Math.round((index / (stages.length - 1)) * 100);
      pipe.style.setProperty('--pipe-pct', reduced ? '100%' : pct + '%');
      pipe.dataset.active = String(index);
      if (token) token.style.left = 'calc(' + pct + '% - 5px)';
      detail.classList.remove('pipe-detail-flash');
      void detail.offsetWidth;
      detail.classList.add('pipe-detail-flash');
    }

    stages.forEach((btn, index) => {
      btn.addEventListener('click', () => activate(btn, index));
      btn.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: hover)').matches) activate(btn, index);
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(btn, index);
        }
      });
    });

    activate(stages[0], 0);

    if (!reduced && stages.length > 1) {
      let i = 0;
      let timer = setInterval(() => {
        i = (i + 1) % stages.length;
        activate(stages[i], i);
      }, 4200);
      pipe.addEventListener(
        'pointerdown',
        () => {
          clearInterval(timer);
          timer = null;
        },
        { once: true }
      );
    }
  });
})();
