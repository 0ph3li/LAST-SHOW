/* ═══════════════════════════════════════════════════════════════
   LAST SHOW — the week
   the next six shows, one slide each. monday the screen rests.
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const LS = window.LS;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const G = !!window.gsap && !!window.ScrollTrigger;
  const RM = LS.RM;
  const put = (k, v) => $$(`[data-f="${k}"]`).forEach(el => (el.textContent = v));
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  /* ═══ the next six shows, in order ═══ */
  const SHOWS = [];
  for (let k = 0; SHOWS.length < 6 && k < 12; k++) { const s = LS.show(k); if (s) SHOWS.push(s); }
  const dm = (t) => { const d = new Date(t); return `${LS.pad(d.getUTCDate())}.${LS.pad(d.getUTCMonth() + 1)}`; };
  const info = (s) => {
    const f = s.f, ends = LS.ends(f), spare = LS.TRAM - ends - LS.WALK;
    const seed = Math.floor(s.day / 864e5), left = 94 - (40 + ((seed * 7919) % 47));
    return { f, ends, spare, left, day: LS.DAYS[s.dow], date: dm(s.day) };
  };
  const isoWeek = (t) => {
    const d = new Date(t), day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day + 3);
    const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    return 1 + Math.round(((d - y0) / 864e5 - 3 + ((y0.getUTCDay() + 6) % 7)) / 7);
  };
  const wk = isoWeek(SHOWS[0].day);
  put('wkno', `n°${wk}`);
  put('range', `${dm(SHOWS[0].day)} – ${dm(SHOWS[SHOWS.length - 1].day)} · one screen · 23:40`);
  const img = (slug, n) => `img/HOME/film-${slug}${n ? '-' + n : ''}.jpg`;

  /* ═══ 01 · the index: six nights, one picture at a time ═══ */
  const idx = $('.wh__idx'), imgs = $('.wh__imgs'), ti = $('.wh__ti');
  idx.innerHTML = SHOWS.map((s, i) => `<li><button type="button" data-i="${i}" data-cur="${s.f.title}">${LS.pad(i + 1)}<small>${LS.DAYS[s.dow].slice(0, 3)} · ${s.f.title}</small></button></li>`).join('');
  imgs.innerHTML = SHOWS.map(s => `<img src="${img(s.f.slug, 4)}" alt="" decoding="async">`).join('');
  const bIdx = $$('button', idx), iImg = $$('img', imgs);
  let on = -1, timer = null;
  const txtKids = () => $$('.wh__txt p > *');
  const feature = (i, anim = true) => {
    i = (i + SHOWS.length) % SHOWS.length;
    if (i === on) return;
    on = i;
    const s = SHOWS[i], x = info(s);
    bIdx.forEach((b, k) => b.classList.toggle('is-on', k === i));
    iImg.forEach((m, k) => m.classList.toggle('is-on', k === i));
    const set = () => {
      put('ft', x.f.title);
      put('fd', `${x.day} ${x.date} · 23:40 → ${LS.hm(x.ends)}`);
      put('fs', x.spare >= 0 ? `${plural(x.spare, 'minute')} to spare for the last 28 · ${x.left} seats left` : `runs long: we hold the doors · ${x.left} seats left`);
      put('wkno2', LS.pad(i + 1));
      ti.innerHTML = `<img src="${img(x.f.slug, 3)}" alt="">`;
      $$('[data-f="qrlink"], [data-f="thumblink"]').forEach(a => (a.href = `tonight.html?d=${s.dow}`));
    };
    if (!G || !anim || RM) return set();
    gsap.to(txtKids(), { opacity: 0, y: -8, duration: .2, stagger: .03, ease: 'power2.in', onComplete: () => {
      set();
      gsap.fromTo(txtKids(), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'expo.out' });
    } });
    gsap.fromTo(iImg[i], { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out' });
  };
  const play = () => { clearInterval(timer); timer = setInterval(() => feature(on + 1), 4600); };
  idx.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { feature(+b.dataset.i); play(); } });
  feature(0, false); play();

  /* a door code that looks like a qr (decorative, seeded by the week) */
  const code = $('.wh__code');
  let r = wk * 9301 + 49297;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  const finder = (x, y) => [[0, 0], [8, 0], [0, 8]].some(([a, b]) => x >= a && x < a + 3 && y >= b && y < b + 3);
  code.innerHTML = Array.from({ length: 121 }, (_, n) => { const x = n % 11, y = Math.floor(n / 11); return `<i class="${finder(x, y) || rnd() > .52 ? '' : 'o'}"></i>`; }).join('');

  /* ═══ 02 · the deck: one slide per night ═══ */
  const page = (x) => `<p class="sl__page">LAST SHOW | ${x.day.slice(0, 3)} ${x.date}</p>`;
  const when = (x) => `<p class="sl__when">23:40 → ${LS.hm(x.ends)}<br>${x.spare >= 0 ? plural(x.spare, 'minute') + ' to spare' : 'we hold the doors'} · ${x.left} seats left</p>`;
  const pic = (x) => `<figure class="sl__img slot" data-img="HOME/film-${x.f.slug}-8.jpg" data-tone="${x.f.tone}"></figure>`;
  const TPL = {
    concept: (x) => `${pic(x)}<p class="sl__dir">${x.f.dir}</p><h3 class="sl__big">${x.f.title}</h3><p class="sl__syn">${x.f.syn}</p><div class="sl__genre"><i class="sl__line"></i><b>genre</b><small>${x.f.genre}</small></div>${page(x)}`,
    wide: (x) => `${pic(x)}<p class="sl__dir">${x.f.dir}</p><i class="sl__line"></i><p class="sl__syn"><b>${x.f.title}.</b> ${x.f.syn}</p><div class="sl__tag"><b>#${x.day}</b><p>“${x.f.q[0][0]}”</p><small>— ${x.f.q[0][1]}</small></div>${page(x)}${when(x)}`,
    title: (x) => `${pic(x)}<p class="sl__dir">${x.f.dir} · ${x.f.year}</p><div class="sl__t"><i class="sl__line"></i><h3 class="sl__big">${x.f.title}</h3></div><p class="sl__syn">${x.f.syn}</p>${page(x)}${when(x)}`
  };
  $$('.sl[data-n]').forEach(el => {
    const s = SHOWS[+el.dataset.n];
    if (!s) return el.remove();
    const type = el.classList.contains('sl--wide') ? 'wide' : el.classList.contains('sl--title') ? 'title' : 'concept';
    el.innerHTML = TPL[type](info(s));
    el.dataset.cur = `${LS.DAYS[s.dow]}, ${dm(s.day)}`;
  });
  LS.setSlot($('.sl--cover .sl__img'), `HOME/film-${SHOWS[0].f.slug}-2.jpg`, null, SHOWS[0].f.tone);
  $$('.sl [data-img]').forEach(LS.fillSlot);
  $('.sl__tiles').innerHTML = Array.from({ length: 9 }, (_, i) => {
    const s = SHOWS[i % SHOWS.length], v = i < SHOWS.length ? 5 : 6;
    return `<div class="sl__tile"><img src="${img(s.f.slug, v)}" alt="" loading="lazy" decoding="async"><span>${s.f.title}</span></div>`;
  }).join('');

  /* ═══ motion ═══ */
  const chars = (el) => { el.innerHTML = el.textContent.split(' ').map(w => `<span class="wd">${[...w].map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' '); return $$('.ch', el); };
  if (!G || RM) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 01 · the panel lands, the word drops in letter by letter */
  gsap.set('.wh__panel', { scale: .94, opacity: 0 });
  gsap.set('.wh__word span', { xPercent: 60, opacity: 0 });
  gsap.set('.wh__pic', { yPercent: 40 });
  gsap.set(['.wh__idx li', '.wh__txt', '.wh__qr', '.wh__thumb', '.wh__no', '.wh__top'], { opacity: 0, y: 14 });
  LS.ready.then(() => {
    gsap.timeline()
      .to('.wh__panel', { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' }, 0)
      .to('.wh__word span', { xPercent: 0, opacity: 1, duration: 1, stagger: .08, ease: 'expo.out' }, .25)
      .to('.wh__pic', { yPercent: 0, duration: 1.4, ease: 'expo.out' }, .35)
      .to('.wh__top', { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, .5)
      .to(['.wh__no', '.wh__txt', '.wh__qr', '.wh__thumb'], { opacity: 1, y: 0, duration: .9, stagger: .07, ease: 'expo.out' }, .6)
      .to('.wh__idx li', { opacity: 1, y: 0, duration: .7, stagger: .05, ease: 'expo.out' }, .7);
  });
  gsap.to('.wh__pic', { y: -60, ease: 'none', scrollTrigger: { trigger: '.wh', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.wh__word', { y: 80, ease: 'none', scrollTrigger: { trigger: '.wh', start: 'top top', end: 'bottom top', scrub: true } });

  /* 02 · each slide: the still settles, the title rises, the line draws */
  $$('.sl').forEach(sl => {
    const im = $('.sl__img', sl);
    if (im) gsap.fromTo(im, { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: sl, start: 'top bottom', end: 'bottom top', scrub: true } });
    const big = $$('.sl__big, .sl__h, .sl__tag b', sl).flatMap(chars);
    const tl = gsap.timeline({ scrollTrigger: { trigger: sl, start: 'top 72%' } });
    if (big.length) tl.from(big, { yPercent: 105, duration: 1, stagger: .025, ease: 'expo.out' }, 0);
    tl.from($$('.sl__line', sl), { scaleX: 0, duration: 1.1, ease: 'expo.inOut' }, .1)
      .from($$('.sl__syn, .sl__genre small, .sl__genre b, .sl__tag p, .sl__tag small, .sl__kick, .sl__sub, .sl__dir, .sl__page, .sl__when', sl), { opacity: 0, y: 14, duration: .9, stagger: .04, ease: 'expo.out' }, .25);
  });
  gsap.from('.sl__tile', { opacity: 0, scale: .9, duration: .9, stagger: { each: .06, from: 'random' }, ease: 'expo.out', scrollTrigger: { trigger: '.sl--mood', start: 'top 75%' } });

  /* 03 · monday: the word pulls back into place */
  gsap.fromTo('.mo__h', { scale: 1.35, opacity: .2 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.mo', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.from('.mo__p', { opacity: 0, y: 16, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.mo', start: 'center 70%' } });
})();
