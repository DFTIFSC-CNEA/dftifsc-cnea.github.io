// Menú móvil + filtros de la página de publicaciones (?m=slug, ?g=grupo)
const btn = document.querySelector('.menu'), nav = document.getElementById('nav');
if (btn) btn.addEventListener('click', () => {
  const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o);
});

const list = document.getElementById('plist');
if (list) {
  const q = document.getElementById('q'), g = document.getElementById('g'), m = document.getElementById('m'),
        art = document.getElementById('art'), count = document.getElementById('count');
  const items = [...list.querySelectorAll('li')].map(li => ({li, txt: li.textContent.toLowerCase(),
    m: li.dataset.m.split(' '), g: li.dataset.g.split(' '), k: li.dataset.k}));
  const sp = new URLSearchParams(location.search);
  if (sp.get('m')) m.value = sp.get('m');
  if (sp.get('g')) g.value = sp.get('g');
  if (sp.get('q')) q.value = sp.get('q');
  function apply() {
    const t = q.value.trim().toLowerCase(); let n = 0;
    for (const it of items) {
      const show = (!t || it.txt.includes(t)) && (!g.value || it.g.includes(g.value)) &&
                   (!m.value || it.m.includes(m.value)) && (!art.checked || it.k === 'article');
      it.li.classList.toggle('hide', !show); n += show;
    }
    list.querySelectorAll('.yr').forEach(s => s.classList.toggle('hide', !s.querySelector('li:not(.hide)')));
    count.textContent = n + ' ' + count.dataset.shown;
    const u = new URLSearchParams();
    if (m.value) u.set('m', m.value); if (g.value) u.set('g', g.value);
    history.replaceState(null, '', u.toString() ? '?' + u : location.pathname);
  }
  [q, g, m, art].forEach(el => el.addEventListener('input', apply));
  apply();
}

// correo armado recién al hacer clic (no aparece en el HTML)
document.querySelectorAll('button.mail').forEach(b => b.addEventListener('click', () => {
  const m = atob(b.dataset.a).split('').reverse().join(''), a = document.createElement('a');
  a.href = 'mailto:' + m; a.textContent = m; b.replaceWith(a);
}));
