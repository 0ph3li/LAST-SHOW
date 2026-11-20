/* ═══════════════════════════════════════════════════════════════
   LAST SHOW — the room
   the slider, the four rooms, and the real map of the 94 seats
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const LS = window.LS;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const G = !!window.gsap && !!window.ScrollTrigger;
  const RM = LS.RM;
  const put = (k, v, html) => $$(`[data-f="${k}"]`).forEach(el => (html ? (el.innerHTML = v) : (el.textContent = v)));
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const lines = (el, html) => { el.innerHTML = html.split('<br>').map(l => `<span class="ln"><span>${l}</span></span>`).join(''); return $$('.ln > span', el); };

  /* ═══ 01 · the slider: four views of the room, red on red ═══ */
  const HEADS = ['one screen.<br>one film.<br>no second show.', 'plaster, gilt<br>and ninety-four<br>red seats.', 'the balcony<br>has been closed<br>since 1987.', 'row f is<br>the best row<br>in the room.'];
  const slides = $$('.rb__img'), head = $('.rb__head'), bar = $('.rb__bar i');
  let sOn = 0, barTw = null;
  lines(head, HEADS[0]);
  const go = (i) => {
    i = (i + slides.length) % slides.length;
    const prev = sOn; sOn = i;
    slides.forEach((s, k) => s.classList.toggle('is-on', k === i));
    put('rbn', LS.pad(i + 1));
    if (!G || RM) { lines(head, HEADS[i]); return; }
    const img = $('img', slides[i]);
    if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 6, ease: 'power1.out' });
    gsap.to($$('.ln > span', head), { yPercent: -110, duration: .35, stagger: .04, ease: 'power2.in', onComplete: () => {
      gsap.from(lines(head, HEADS[i]), { yPercent: 110, duration: .9, stagger: .07, ease: 'expo.out' });
    } });
    if (barTw) barTw.kill();
    barTw = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 5.5, ease: 'none', onComplete: () => go(sOn + 1) });
    return prev;
  };
  $('.rb__prev').addEventListener('click', () => go(sOn - 1));
  $('.rb__next').addEventListener('click', () => go(sOn + 1));
  $('.rb__lights').addEventListener('click', () => LS.lights());

  /* ═══ 03 · the map: ten rows, an aisle, 94 seats. f7 is never sold ═══ */
  const ROWS = [['a', 8], ['b', 8], ['c', 9], ['d', 9], ['e', 10], ['f', 10], ['g', 10], ['h', 10], ['i', 10], ['j', 10]];
  const ALL = ROWS.flatMap(([r, n]) => Array.from({ length: n }, (_, k) => r + (k + 1)));
  const rowsEl = $('.st__rows');
  rowsEl.innerHTML = ROWS.map(([r, n]) => {
    const half = Math.ceil(n / 2);
    const seat = (k) => `<button type="button" class="seat${r + k === 'f7' ? ' is-f7' : ''}" data-s="${r + k}" aria-label="row ${r}, seat ${k}"><span>${k}</span></button>`;
    const left = Array.from({ length: half }, (_, k) => seat(k + 1)).join('');
    const right = Array.from({ length: n - half }, (_, k) => seat(half + k + 1)).join('');
    return `<div class="st__row" role="row"><b>${r}</b><div class="st__half">${left}</div><i class="st__aisle"></i><div class="st__half">${right}</div><b>${r}</b></div>`;
  }).join('');
  const seats = $$('.seat', rowsEl);

  const SHOWS = [];
  for (let k = 0; SHOWS.length < 6 && k < 12; k++) { const s = LS.show(k); if (s) SHOWS.push(s); }
  const dm = (t) => { const d = new Date(t); return `${LS.pad(d.getUTCDate())}.${LS.pad(d.getUTCMonth() + 1)}`; };
  const want = new URLSearchParams(location.search).get('d');
  let nOn = Math.max(0, SHOWS.findIndex(s => String(s.dow) === want));
  const nights = $('.st__nights');
  nights.innerHTML = SHOWS.map((s, i) => `<li><button type="button" data-i="${i}" data-cur="${s.f.title}">${LS.DAYS[s.dow].slice(0, 3)} ${dm(s.day)}<b>${s.f.title}</b></button></li>`).join('');

  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const takenFor = (s) => {
    const seed = Math.floor(s.day / 864e5);
    const n = 40 + ((seed * 7919) % 47) - 1;            // f7 counts as one of the unavailable seats
    const r = rng(seed), pool = ALL.filter(x => x !== 'f7');
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    return new Set(pool.slice(0, n));
  };
  const NOTE = { a: 'row a. close enough to feel it in your neck, in a good way.', b: 'row b. you’ll see the grain of the film.', c: 'row c. the critics’ row, they say.', d: 'row d. where the regulars sit.', e: 'row e. dead centre of the sound.', f: 'row f. the best row in the room.', g: 'row g. far enough to see everything at once.', h: 'row h. the couples’ row, for some reason.', i: 'row i. close to the door, for a quick run to the tram.', j: 'the last row. for people who leave on the last frame.' };
  let picked = null, taken = new Set();
  const tk = $('.tk'), hold = $('.st__hold');
  const render = () => {
    const s = SHOWS[nOn], f = s.f, ends = LS.ends(f), spare = LS.TRAM - ends - LS.WALK;
    taken = takenFor(s);
    const held = LS.get('held', null);
    const mine = held && held.day === s.day ? held.seat : null;
    picked = mine;
    seats.forEach(b => {
      const id = b.dataset.s;
      b.classList.toggle('is-x', taken.has(id));
      b.classList.toggle('is-me', id === mine);
    });
    $$('button', nights).forEach((b, k) => b.classList.toggle('is-on', k === nOn));
    put('tkfilm', f.title);
    put('tkwhen', `${LS.DAYS[s.dow]} ${dm(s.day)} · doors 23:00 · film 23:40`);
    put('tktram', `lights up ${LS.hm(ends)} · last 28 at 01:52 · ${spare >= 0 ? plural(spare, 'minute') + ' to spare' : 'we hold the doors'}`);
    put('tkrow', mine ? mine[0] : '—'); put('tkseat', mine ? mine.slice(1) : '—');
    put('tknote', mine ? `held for you until 23:30. say “${mine}” at the door.` : `${94 - taken.size - 1} seats left. pick a free one on the map.`);
    tk.classList.toggle('is-held', !!mine);
    hold.disabled = true;
    hold.textContent = mine ? 'held ✓' : 'hold this seat';
  };
  const bump = () => { if (G && !RM) gsap.fromTo(tk, { y: 8, rotation: -1.2 }, { y: 0, rotation: 0, duration: .7, ease: 'elastic.out(1, .5)' }); };
  rowsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.seat'); if (!b) return;
    const id = b.dataset.s;
    if (id === 'f7') { put('tknote', 'f7 is never sold. it belongs to the man who reopened the room, and he still comes on fridays.'); bump(); return; }
    if (taken.has(id)) { if (G && !RM) gsap.fromTo(b, { x: -3 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' }); put('tknote', `${id} is taken tonight. try the one next to it.`); return; }
    picked = id;
    seats.forEach(x => x.classList.toggle('is-me', x === b));
    put('tkrow', id[0]); put('tkseat', id.slice(1));
    put('tknote', NOTE[id[0]]);
    tk.classList.remove('is-held');
    hold.disabled = false; hold.textContent = `hold ${id}`;
    bump();
  });
  hold.addEventListener('click', () => {
    if (!picked) return;
    LS.set('held', { day: SHOWS[nOn].day, seat: picked });
    render(); bump();
  });
  nights.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; nOn = +b.dataset.i; render(); bump(); });
  render();

  /* ═══ motion ═══ */
  const chars = (el) => { el.innerHTML = [...el.textContent].map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join(''); return $$('.ch', el); };
  if (!G || RM) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 01 · the panel lands, the title rises, the slider starts */
  gsap.set('.rb__panel', { scale: .94, opacity: 0 });
  gsap.set('.rb__ln > span', { yPercent: 110 });
  gsap.set(['.rb__nav', '.rb__meta', '.rb__facts', '.rb__ctrl', '.rb__rail', '.rb__lights'], { opacity: 0 });
  gsap.set($$('.ln > span', head), { yPercent: 110 });
  LS.ready.then(() => {
    gsap.timeline({ onComplete: () => { barTw = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 5.5, ease: 'none', onComplete: () => go(sOn + 1) }); } })
      .to('.rb__panel', { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' }, 0)
      .to('.rb__ln > span', { yPercent: 0, duration: 1.1, stagger: .1, ease: 'expo.out' }, .3)
      .to(['.rb__nav', '.rb__rail', '.rb__meta', '.rb__facts', '.rb__ctrl', '.rb__lights'], { opacity: 1, duration: .8, stagger: .05, ease: 'power2.out' }, .6)
      .to($$('.ln > span', head), { yPercent: 0, duration: .9, stagger: .07, ease: 'expo.out' }, .8);
  });
  gsap.to('.rb__panel', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.rb', start: 'top top', end: 'bottom top', scrub: true } });

  /* 02 · the rooms stack: each one settles back as the next slides over it */
  const ris = $$('.ri__s');
  ris.forEach((s, i) => {
    const dim = document.createElement('i'); dim.className = 'ri__dim'; s.appendChild(dim);
    const w = chars($('.ri__w', s));
    gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 60%' } })
      .from(w, { yPercent: 100, opacity: 0, duration: 1, stagger: .05, ease: 'expo.out' })
      .from($('.ri__p', s), { opacity: 0, y: 24, duration: 1, ease: 'expo.out' }, .2)
      .from([$('.ri__tab', s), $('.ri__n', s)], { opacity: 0, x: 20, duration: .9, stagger: .08, ease: 'expo.out' }, .3);
    const win = $('.ri__win', s);
    gsap.fromTo(win, { scale: .9 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'top top', scrub: true } });
    if (i < ris.length - 1) gsap.timeline({ scrollTrigger: { trigger: ris[i + 1], start: 'top bottom', end: 'top top', scrub: true } })
      .to(s, { scale: .92, ease: 'none' }, 0).to(dim, { opacity: .5, ease: 'none' }, 0);
  });

  /* 03 · the seats come on row by row, from the screen back */
  gsap.from(chars($('.st__h')), { yPercent: 100, opacity: 0, duration: 1, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: '.st', start: 'top 70%' } });
  gsap.from('.st__screen', { scaleX: .4, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.st__room', start: 'top 75%' } });
  gsap.from(seats, { scale: 0, opacity: 0, duration: .6, stagger: { each: .008, from: 'start' }, ease: 'back.out(2)', scrollTrigger: { trigger: '.st__rows', start: 'top 80%' } });
  gsap.from('.tk', { y: 60, rotation: 3, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.st__tkt', start: 'top 85%' } });
})();
