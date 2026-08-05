/**
 * Portfolio Assistant — guided explorer using assistant-data.json only.
 * No external AI, no hallucination, no network beyond local JSON.
 */
(function () {
  const root = document.getElementById('assistant');
  if (!root) return;

  const promptsEl = root.querySelector('[data-assistant-prompts]');
  const outEl = root.querySelector('[data-assistant-out]');
  const input = root.querySelector('#assistantQ');
  const form = root.querySelector('[data-assistant-form]');
  let data = null;

  function renderAnswer(ans) {
    if (!outEl || !ans) return;
    outEl.innerHTML =
      '<p class="eyebrow">Guided answer</p>' +
      '<h3>' +
      ans.title +
      '</h3>' +
      '<p class="case-prose">' +
      ans.body +
      '</p>' +
      '<ol class="assistant-list">' +
      (ans.links || [])
        .map(function (l, i) {
          return (
            '<li><a class="text-link" href="' +
            l.u +
            '"><strong>' +
            (i + 1) +
            '. ' +
            l.t +
            '</strong></a><span>' +
            l.d +
            '</span></li>'
          );
        })
        .join('') +
      '</ol>' +
      '<p class="assistant-note">Answers use only published portfolio pages — nothing invented.</p>';
    outEl.hidden = false;
  }

  function matchQuery(q) {
    const s = (q || '').toLowerCase().trim();
    if (!s || !data) return data && data.fallback;
    if (data.answers[s]) return data.answers[s];
    // keyword match against prompt text and known ids
    const rules = [
      { re: /ai project|ocr|document intelligence|intelligence/, id: 'ai-projects' },
      { re: /legal|nepalipms|ipms|trademark/, id: 'legaltech' },
      { re: /decision|tradeoff|architect/, id: 'decisions' },
      { re: /founder|build a product|start/, id: 'founder' },
      { re: /now|building|current|roadmap/, id: 'now' },
      { re: /ocr|bulletin|pipeline/, id: 'ocr' },
    ];
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].re.test(s)) return data.answers[rules[i].id];
    }
    for (let j = 0; j < (data.prompts || []).length; j++) {
      const p = data.prompts[j];
      if (p.q.toLowerCase().indexOf(s) !== -1 || s.indexOf(p.q.toLowerCase().slice(0, 12)) !== -1) {
        return data.answers[p.id];
      }
    }
    return data.fallback;
  }

  async function init() {
    try {
      const res = await fetch('/js/assistant-data.json', { credentials: 'omit' });
      data = await res.json();
    } catch (_) {
      return;
    }
    if (promptsEl) {
      promptsEl.innerHTML = (data.prompts || [])
        .map(function (p) {
          return '<button type="button" class="assistant-chip" data-id="' + p.id + '">' + p.q + '</button>';
        })
        .join('');
      promptsEl.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-id]');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        renderAnswer(data.answers[id] || data.fallback);
        if (input) input.value = btn.textContent;
      });
    }
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        renderAnswer(matchQuery(input && input.value));
      });
    }
  }

  init();
})();
