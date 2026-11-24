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

// carrusel de figuras: orden aleatorio, 5 s, pausa al pasar el mouse, flechas y deslizamiento
document.querySelectorAll('.car').forEach(car => {
  const D = JSON.parse(car.querySelector('.car-data').textContent);
  for (let i = D.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [D[i], D[j]] = [D[j], D[i]]; }
  const a = car.querySelector('.car-stage'), img = a.querySelector('img'), t = car.querySelector('.car-t'),
        c = car.querySelector('.car-c'), dots = car.querySelector('.car-dots');
  const nd = Math.min(D.length, 24);
  dots.innerHTML = '<i></i>'.repeat(nd);
  let k = 0, timer = null, hover = false;
  function show(i) {
    k = (i + D.length) % D.length; const d = D[k];
    img.classList.add('fade');
    const pre = new Image(); pre.onload = pre.onerror = () => { img.src = d.img; img.alt = d.t; img.classList.remove('fade'); };
    pre.src = d.img;
    a.href = d.u; t.textContent = d.t; c.textContent = d.c;
    [...dots.children].forEach((x, j) => x.classList.toggle('on', j === k % nd));
    const nx = new Image(); nx.src = D[(k + 1) % D.length].img;
  }
  const go = () => { clearInterval(timer); if (!hover && !document.hidden) timer = setInterval(() => show(k + 1), 5000); };
  car.querySelectorAll('.car-b').forEach(b => b.addEventListener('click', () => { show(k + +b.dataset.d); go(); }));
  car.addEventListener('mouseenter', () => { hover = true; go(); });
  car.addEventListener('mouseleave', () => { hover = false; go(); });
  document.addEventListener('visibilitychange', go);
  let x0 = null;
  a.addEventListener('touchstart', e => x0 = e.touches[0].clientX, {passive: true});
  a.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { e.preventDefault(); show(k + (dx < 0 ? 1 : -1)); go(); } x0 = null; });
  show(0); go();
});

// modo claro/oscuro: sigue al sistema; el botón lo fija y se recuerda en este navegador
document.querySelectorAll('button.theme').forEach(b => b.addEventListener('click', () => {
  const r = document.documentElement, cur = r.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nx = cur === 'dark' ? 'light' : 'dark';
  const sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  r.dataset.theme = nx;
  try { nx === sys ? localStorage.removeItem('theme') : localStorage.setItem('theme', nx); } catch (e) {}
}));
