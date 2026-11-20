/* ═══════════════════════════════════════════════════════════════
   LAST SHOW — home
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const LS = window.LS, { $, $$, RM } = LS;
  const G = !!window.gsap && !!window.ScrollTrigger;
  const img = (f) => 'HOME/film-' + f.slug + '.jpg';
  const note = (f) => 'a still from ' + f.title + ' (' + f.year + ')';

  /* ═══ 01 · hero: fit the broken title to the width ═══ */
  const hero = $('.hero'), ht = $('.ht');
  const fit = () => {
    ht.style.setProperty('--fs', '100px');
    const w = ht.parentElement.clientWidth, sw = ht.getBoundingClientRect().width;
    const fs = Math.min(100 * w / sw, innerHeight * .5);
    ht.style.setProperty('--fs', fs + 'px');
    hero.style.setProperty('--th', ht.getBoundingClientRect().height + 'px');
  };
  fit();
  document.fonts && document.fonts.ready.then(fit);
  addEventListener('resize', fit);

  /* countdown */
  const cEl = $('[data-count]'), sEl = $('[data-state]'), cBox = $('.hero__count');
  const tick = () => {
    const s = LS.show();
    if (!s) return;
    const lbl = {
      next: s.dow === new Date(s.now).getUTCDay() ? 'tonight’s film in' : LS.DAYS[s.dow] + '’s film in',
      doors: 'doors are open · film in', live: 'now showing · ends in', run: 'the film ended · last 28 in'
    }[s.state];
    const to = { next: s.start, doors: s.start, live: s.end, run: s.tram }[s.state];
    sEl.textContent = lbl;
    cEl.textContent = LS.hms(to - s.now);
    cBox.classList.toggle('is-live', s.state === 'live' || s.state === 'run');
  };
  tick(); setInterval(tick, 1000);

  /* ═══ 02 · tonight: two cards from the timetable ═══ */
  const fillCard = (card, s, i) => {
    const f = s.f, today = new Date(s.now).getUTCDay();
    const when = s.state === 'live' ? 'now showing' : s.state === 'run' ? 'just ended' : i === 0 && s.dow === today ? 'tonight' : (s.day - Math.floor(s.now / 864e5) * 864e5) === 864e5 ? 'tomorrow' : LS.DAYS[s.dow];
    $('[data-f="year"]', card).textContent = f.year;
    $('[data-f="dir"]', card).textContent = f.dir;
    $('[data-f="label"]', card).textContent = when + ' · 23:40 · ' + LS.date(s.day).slice(0, 5);
    $('[data-f="title"]', card).textContent = f.title;
    $('[data-f="meta"]', card).textContent = 'runtime ' + f.min + '′ · ends ' + LS.hm(LS.ends(f)) + ' · last 28 at ' + LS.hm(LS.TRAM);
    $('[data-f="quotes"]', card).innerHTML = f.q.map(([q, w]) => `<li><span class="st">★★★★★</span><q>${q}</q><small>${w}</small></li>`).join('');
    LS.setSlot($('.slot', card), img(f), note(f), f.tone);
  };
  const s0 = LS.show(), s1 = LS.show(1);
  const cards = $$('.card');
  if (s0) fillCard(cards[0], s0, 0);
  if (s1) fillCard(cards[1], s1, 1);

  /* ═══ 02 · whisper + 04 · saudade: split into letters ═══ */
  const split = (el) => { el.innerHTML = [...el.textContent].map(c => `<span class="ch">${c === ' ' ? ' ' : c}</span>`).join(''); return $$('.ch', el); };
  const whChars = $$('.wh__line').flatMap(split);
  const sdEl = $('.sd__w');
  sdEl.innerHTML = [...sdEl.textContent].map(c => `<span class="ch"><b>${c}</b><i aria-hidden="true">${c}</i></span>`).join('');
  const sdChars = $$('.ch', sdEl);

  /* ═══ 05 · lovers: split into letters ═══ */
  const chars = [];
  $$('.lv__word').forEach(w => {
    w.innerHTML = [...w.textContent].map(c => `<span class="ch">${c}</span>`).join('');
    chars.push(...$$('.ch', w));
  });

  /* ═══ 04 · the week ═══ */
  const wk = $('.wk'), daysEl = $('.wk__days'), ratios = $('.wk__ratios'), frame = $('.wk__frame');
  const wkSlot = $('.wk__img', frame);
  daysEl.innerHTML = LS.ORDER.map((d, i) => {
    const f = LS.WEEK[d];
    return `<li data-d="${d}" data-cur="${f ? f.title : 'rest'}"><b>${LS.pad(i + 1)} · ${LS.DAYS[d].slice(0, 3)}</b><span>${f ? f.title : 'the screen rests'}</span></li>`;
  }).join('');
  ratios.innerHTML = LS.ORDER.map(d => `<span>${LS.WEEK[d] ? LS.WEEK[d].ar.toFixed(2) + ':1' : 'dark'}</span>`).join('');
  let wkOn = -1;
  const setDay = (d) => {
    d = +d;
    if (d === wkOn) return;
    wkOn = d;
    const f = LS.WEEK[d], i = LS.ORDER.indexOf(d);
    $$('li', daysEl).forEach(li => li.classList.toggle('is-on', +li.dataset.d === d));
    frame.style.setProperty('--ar', f ? f.ar : 2.39);
    $('.wk__n', frame).textContent = LS.pad(i + 1);
    $('.wk__day', frame).textContent = LS.DAYS[d] + (f ? ' · ' + f.min + '′ · ends ' + LS.hm(LS.ends(f)) : '');
    const t = $('.wk__t', frame);
    t.textContent = f ? f.title : 'the screen rests';
    if (f) LS.setSlot(wkSlot, 'HOME/film-' + f.slug + '-2.jpg', note(f), f.tone);
    else { wkSlot.dataset.tone = 'night'; LS.setSlot(wkSlot, '', 'monday: no film. the projector sleeps.'); }
    if (G && !RM) {
      gsap.fromTo(t, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' });
      gsap.fromTo(wkSlot, { scale: 1.08, opacity: .35 }, { scale: 1, opacity: 1, duration: .9, ease: 'expo.out' });
    }
  };
  setDay(s0 ? s0.dow : 2);
  let wkHover = false, wkIn = false;
  daysEl.addEventListener('pointerover', (e) => { const li = e.target.closest('li'); if (li) { wkHover = true; setDay(li.dataset.d); } });
  daysEl.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) setDay(li.dataset.d); });
  wk.addEventListener('pointerleave', () => (wkHover = false));
  setInterval(() => {
    if (wkHover || !wkIn || RM) return;
    const i = LS.ORDER.indexOf(wkOn);
    setDay(LS.ORDER[(i + 1) % LS.ORDER.length]);
  }, 3200);

  /* ═══ 08–09 · the tram poster + the walk: will you make it? ═══ */
  const tr = $('.tr'), sk = $('.sk'), range = $('input', sk), filmsEl = $('.sk__films', sk);
  let trDay = s0 ? s0.dow : 2;
  $('[data-f="date"]', tr).textContent = s0 ? LS.date(s0.day) : '';
  const tw = $('.tr__tw');
  const fitTr = () => {
    tw.style.setProperty('--trfs', '100px');
    const w = tw.parentElement.clientWidth, sw = tw.getBoundingClientRect().width;
    tw.style.setProperty('--trfs', (100 * w / sw * .995) + 'px');
  };
  fitTr(); document.fonts && document.fonts.ready.then(fitTr); addEventListener('resize', fitTr);
  filmsEl.innerHTML = LS.ORDER.filter(d => LS.WEEK[d]).map(d => `<button type="button" data-d="${d}" data-cur="${LS.WEEK[d].min}′">${LS.DAYS[d].slice(0, 3)} · ${LS.WEEK[d].title}</button>`).join('');
  const you = $('.sk__you', sk), car = $('.sk__car', sk), res = $('[data-f="res"]', sk);
  const calc = (animate = true) => {
    const f = LS.WEEK[trDay], cred = +range.value, end = LS.ends(f), arrive = end + cred + LS.WALK, spare = LS.TRAM - arrive;
    $$('button', filmsEl).forEach(b => b.classList.toggle('is-on', +b.dataset.d === trDay));
    $('[data-f="cred"]', sk).textContent = cred;
    $('[data-f="end"]', tr).textContent = LS.hm(end);
    $('[data-f="walk"]', tr).textContent = LS.WALK;
    const verdict = spare > 6 ? 'you make it.' : spare >= 0 ? 'you make it. just. run.' : 'you don’t. walk home, it’s downhill.';
    $('[data-f="verdict"]', tr).textContent = verdict;
    res.classList.toggle('is-miss', spare < 0);
    res.textContent = spare >= 0
      ? `${f.title} ends ${LS.hm(end)} · credits ${cred}′ · walk ${LS.WALK}′ downhill · you reach camões at ${LS.hm(arrive)} · ${spare === 0 ? 'the doors are closing' : spare + ' min to spare'}`
      : `${f.title} ends ${LS.hm(end)} · you reach camões at ${LS.hm(arrive)} · the 28 left at ${LS.hm(LS.TRAM)} · ${-spare} min of tail lights`;
    /* "you" walks the line; the tram waits at its minute, or leaves */
    const span = Math.max(LS.TRAM, arrive) + 2 - end;
    const px = (m) => Math.max(0, Math.min(100, ((m - end) / span) * 100));
    const yx = px(arrive), cx = spare < 0 ? 120 : px(LS.TRAM);
    $('em', you).textContent = spare < 0 ? 'you · ' + LS.hm(arrive) : 'you · ' + LS.hm(arrive);
    $('em', car).textContent = '28 · ' + LS.hm(LS.TRAM);
    if (G && animate && !RM) {
      gsap.to(you, { left: yx + '%', duration: .7, ease: 'power3.out' });
      gsap.to(car, { left: cx + '%', opacity: spare < 0 ? 0 : 1, duration: spare < 0 ? 1.3 : .7, ease: spare < 0 ? 'power2.in' : 'power3.out' });
    } else {
      you.style.left = yx + '%'; car.style.left = cx + '%'; car.style.opacity = spare < 0 ? 0 : 1;
    }
  };
  range.addEventListener('input', () => calc());
  filmsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { trDay = +b.dataset.d; calc(); } });
  calc(false);

  /* ═══ 10 · last shows: every : second ═══ */
  const ARCH = [
    ['tabu', 'tabu', '2012', '14.03.2025', '01:31:12', 'full house. one man clapped for two minutes.', 'tungsten'],
    ['chungking-express', 'chungking express', '1994', '02.05.2025', '01:22:40', 'someone brought pineapple tins. we allowed it.', 'neon'],
    ['past-lives', 'past lives', '2023', '20.06.2025', '01:26:05', 'row d held hands with row e. they’d never met.', 'sea'],
    ['paterson', 'paterson', '2016', '11.07.2025', '01:38:51', 'a bus driver came. we let him in for free.', 'green'],
    ['cleo-from-5-to-7', 'cléo from 5 to 7', '1962', '29.08.2025', '01:12:30', 'the shortest night. everyone made the tram.', 'night'],
    ['before-sunset', 'before sunset', '2004', '19.09.2025', '01:01:58', 'two people missed the 28 on purpose.', 'amber'],
    ['fallen-angels', 'fallen angels', '1995', '24.10.2025', '01:20:14', 'the projector bulb blew at minute 88. we finished it by phone light.', 'neon'],
    ['the-green-ray', 'the green ray', '1986', '05.12.2025', '01:21:47', 'nobody saw it. everybody said they did.', 'tejo'],
    ['paris-texas', 'paris, texas', '1984', '31.12.2025', '02:07:09', '147 minutes. the only night carris held the 28 for us.', 'ember'],
    ['her', 'her', '2013', '13.02.2026', '01:46:20', 'after the film, everyone checked their phones. nobody had a message.', 'ember'],
    ['it-follows', 'it follows', '2014', '06.03.2026', '01:20:40', 'ninety-four people walked to camões looking over their shoulder.', 'night'],
    ['under-the-skin', 'under the skin', '2013', '17.04.2026', '01:28:15', 'the quietest room we’ve ever had. not one cough.', 'night'],
    ['hereditary', 'hereditary', '2018', '05.06.2026', '01:47:30', 'someone clicked their tongue on the 28. the whole car turned around.', 'tungsten'],
    ['nope', 'nope', '2022', '24.07.2026', '01:50:05', 'on the way to the tram, everybody kept looking at the sky.', 'ember'],
    ['bones-and-all', 'bones and all', '2022', '18.09.2026', '01:51:40', '131 minutes. we ran down rua da rosa and caught it with ten seconds left.', 'amber'],
    ['the-substance', 'the substance', '2024', '31.10.2026', '02:01:20', 'halloween. 141 minutes. nobody made the tram, nobody minded.', 'neon']
  ];
  /* an episode guide: one still, the nights on the right. click, or let it play */
  const ep = $('.ep'), epPanel = $('.ep__panel'), epWrap = $('.ep__listwrap'), epList = $('.ep__list');
  $('.ep__imgs').innerHTML = ARCH.map(([slug]) => `<img src="img/HOME/last-${slug}.jpg" alt="" decoding="async">`).join('');
  epList.innerHTML = ARCH.map(([slug, t, y, d, tm], i) => `<li><button type="button" data-i="${i}" data-cur="${t}"><span class="ep__n">${LS.pad(i + 1)}</span><span class="ep__t"><b>${t}</b><small>${y} · lights up ${tm.slice(0, 5)}</small></span><img src="img/HOME/thumbs/last-${slug}.jpg" alt="" decoding="async"></button></li>`).join('');
  const epI = $$('.ep__imgs img'), epB = $$('button', epList);
  const epT = $('[data-f="ept"]'), epL = $('[data-f="epl"]'), epN = $('[data-f="epn"]'), epD = $('[data-f="epd"]');
  const epMob = matchMedia('(max-width: 900px)');
  let epOn = -1, epBarTw = null, epLive = false;
  const epAuto = () => {
    if (epBarTw) epBarTw.kill();
    if (!G || !epLive) return;
    epBarTw = gsap.fromTo('.ep__bar i', { scaleX: 0 }, { scaleX: 1, duration: 6, ease: 'none', onComplete: () => epGo(epOn + 1) });
  };
  const epGo = (i) => {
    i = (i + ARCH.length) % ARCH.length;
    if (i === epOn) return epAuto();
    const first = epOn < 0;
    epOn = i;
    const [slug, t, y, d, tm, line] = ARCH[i];
    const fill = () => {
      epT.textContent = t;
      epL.innerHTML = `${line}<em>${y} · lights up at ${tm}</em>`;
      epN.textContent = LS.pad(i + 1);
      epD.textContent = `${d} ›`;
    };
    epI.forEach((im, k) => im.classList.toggle('is-on', k === i));
    epB.forEach((b, k) => b.classList.toggle('is-on', k === i));
    const words = [epT, epL, epN];
    if (first || !G) fill();
    else {
      gsap.killTweensOf(words);
      gsap.to(words, { opacity: 0, y: -16, duration: .22, ease: 'power2.in', stagger: .03, onComplete: () => {
        fill();
        gsap.fromTo(words, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .06 });
      } });
      gsap.fromTo(epI[i], { scale: 1.08 }, { scale: 1, duration: 2, ease: 'expo.out' });
    }
    /* keep the night you're on in the middle of the list */
    const li = epB[i].parentElement;
    if (epMob.matches) epWrap.scrollTo({ left: li.offsetLeft - 20, behavior: first ? 'auto' : 'smooth' });
    else {
      const y = -Math.max(0, Math.min(li.offsetTop - epWrap.clientHeight / 2 + li.offsetHeight / 2, epList.scrollHeight - epWrap.clientHeight));
      G && !first ? gsap.to(epList, { y, duration: .9, ease: 'expo.out' }) : (epList.style.transform = `translateY(${y}px)`);
    }
    epAuto();
  };
  epList.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) epGo(+b.dataset.i); });
  $('.ep__play').addEventListener('click', () => epGo(epOn + 1));
  epPanel.addEventListener('mouseenter', () => epBarTw && epBarTw.pause());
  epPanel.addEventListener('mouseleave', () => epBarTw && epBarTw.resume());
  epGo(ARCH.length - 1);

  /* ═══ motion ═══ */
  if (!G) { chars.forEach(c => c.classList.add('is-on')); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (RM) {
    chars.forEach(c => c.classList.add('is-on'));
    $$('.rm__stats b').forEach(b => (b.textContent = b.dataset.to));
    wkIn = false;
    return;
  }

  /* hero entrance, after the loader */
  gsap.set('.ht > *', { yPercent: 110, opacity: 0, skewY: 8 });
  gsap.set(['.hero__row', '.hero__pill', '.hero__foot', '.hero__dot'], { opacity: 0 });
  gsap.set('.hero__img', { scale: 1.08 });
  LS.ready.then(() => {
    const tl = gsap.timeline();
    tl.to('.hero__img', { scale: 1, duration: 2.2, ease: 'expo.out' }, 0)
      .to('.ht > *', { yPercent: 0, opacity: 1, skewY: 0, duration: 1.3, ease: 'expo.out', stagger: { each: .06, from: 'center' } }, .1)
      .to(['.hero__row', '.hero__foot'], { opacity: 1, duration: .8 }, .7)
      .fromTo('.hero__pill', { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .8, ease: 'back.out(2)' }, .9)
      .to('.hero__dot', { opacity: 1, duration: .4 }, 1.2);
    gsap.to('.hero__dot', { x: '22vw', y: '-6vh', duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });
  });

  /* hero: the still follows the eye a little, like a slow dolly */
  if (matchMedia('(pointer: fine)').matches) {
    const hx = gsap.quickTo('.hero__img', 'x', { duration: 1.4, ease: 'power3' }), hy = gsap.quickTo('.hero__img', 'y', { duration: 1.4, ease: 'power3' });
    const lx = $$('.ht > *').map((el, i) => gsap.quickTo(el, 'x', { duration: 1 + i * .08, ease: 'power3' }));
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      hx(nx * -30); hy(ny * -20); lx.forEach((q, i) => q(nx * (6 + i * 3)));
    });
  }

  /* hero scroll: the still pushes in, the title lifts away */
  gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__img', { yPercent: 18, scale: 1.08, ease: 'none' }, 0)
    .to('.hero__title', { yPercent: -40, opacity: .2, ease: 'none' }, 0)
    .to('.hero__pill', { y: -120, ease: 'none' }, 0);

  /* tonight: the echo spreads in, then settles */
  gsap.from('.echo__w:not(.echo__w--main)', { y: 0, opacity: 0, ease: 'none', stagger: .02,
    scrollTrigger: { trigger: '.echo', start: 'top 90%', end: 'top 30%', scrub: true } });
  gsap.from('.echo__w--main', { letterSpacing: '.08em', opacity: 0, ease: 'none', scrollTrigger: { trigger: '.echo', start: 'top 95%', end: 'top 45%', scrub: true } });
  gsap.from('.tn__lead span', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.tn__lead', start: 'top 85%' } });
  gsap.from('.tn__lead i', { scaleY: 0, duration: .8, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.tn__lead', start: 'top 85%' } });
  cards.forEach((c, i) => {
    gsap.fromTo($('.card__img', c), { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 10%', scrub: true } });
    gsap.from([...$$('.card__tl, .card__tr li, .card__bl > *, .card__go', c)], { opacity: 0, y: 24, duration: .9, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 70%' } });
    const dim = document.createElement('i'); dim.className = 'card__dim'; c.appendChild(dim);
    if (i < cards.length - 1) gsap.timeline({ scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 9%', scrub: true } })
      .to(c, { scale: .93, ease: 'none' }, 0).to(dim, { opacity: .55, ease: 'none' }, 0);
  });

  /* lovers: the title fills with gold as you read */
  ScrollTrigger.create({
    trigger: '.lv', start: 'top 70%', end: 'bottom 60%', scrub: true,
    onUpdate: (st) => { const n = Math.round(st.progress * chars.length * 1.15); chars.forEach((c, i) => c.classList.toggle('is-on', i < n)); }
  });
  gsap.fromTo('.lv__img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.lv', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.lv__tl, .lv__trr, .lv__top, .lv__cols p, .lv__bl, .lv__br', { opacity: 0, y: 14, duration: 1.2, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: '.lv', start: 'top 50%' } });

  /* week: giant words slide in from opposite sides */
  gsap.from('.wk__h--a', { xPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: wk, start: 'top bottom', end: 'top 30%', scrub: true } });
  gsap.from('.wk__h--b', { xPercent: 30, opacity: 0, ease: 'none', scrollTrigger: { trigger: wk, start: 'top bottom', end: 'top 20%', scrub: true } });
  gsap.from('.wk__grid i', { scaleY: 0, transformOrigin: 'top', duration: 1.4, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: wk, start: 'top 70%' } });
  ScrollTrigger.create({ trigger: wk, start: 'top 60%', end: 'bottom 30%', onToggle: (st) => (wkIn = st.isActive) });

  /* the room: the rounded window opens, the numbers count */
  gsap.fromTo('.rm__img', { scale: .72 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.rm', start: 'top 85%', end: 'top 5%', scrub: true } });
  gsap.from('.rm__h', { xPercent: -24, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.rm', start: 'top 70%', end: 'top 15%', scrub: true } });
  gsap.from('.rm__p', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.rm__win', start: 'top 45%' } });
  gsap.from('.rm__big', { yPercent: 100, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.rm', start: 'top 30%' } });
  $$('.rm__stats b').forEach(b => {
    const o = { v: 0 }, to = +b.dataset.to;
    gsap.to(o, { v: to, duration: to > 100 ? 2.2 : 1.4, ease: 'power3.out', onUpdate: () => (b.textContent = Math.round(o.v)), scrollTrigger: { trigger: '.rm__stats', start: 'top 95%' } });
  });

  /* whisper: the serif breathes in letter by letter, the arch opens onto the river */
  gsap.from(whChars, { opacity: 0, yPercent: 40, ease: 'none', stagger: .04,
    scrollTrigger: { trigger: '.wh', start: 'top 85%', end: 'top 20%', scrub: true } });
  gsap.fromTo('.wh__dot', { scale: 0 }, { scale: 1, duration: 1, ease: 'elastic.out(1, .4)', scrollTrigger: { trigger: '.wh__dot', start: 'top 80%' } });
  gsap.to('.wh__dot', { opacity: .25, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.from('.wh__meta li', { opacity: 0, y: 12, duration: .8, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.wh__meta', start: 'top 88%' } });
  /* the window grows (transform), the photo inside counter-scales so it stays still: a door opening, not a zoom */
  const whWin = $('.wh__win'), whImg = $('.wh__img');
  const setW = gsap.quickSetter(whWin, 'scale'), setI = gsap.quickSetter(whImg, 'scale');
  const whS = { v: .38 };
  const whApply = () => { setW(whS.v); setI((1 / whS.v) * (1 + .12 * whS.v)); };
  whApply();
  gsap.to(whS, { v: 1, ease: 'none', onUpdate: whApply, scrollTrigger: { trigger: '.wh__arch', start: 'top 95%', end: 'top 10%', scrub: true } });
  gsap.fromTo('.wh__img > img', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.wh__arch', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* saudade: the city starts moving. the word smears into the crowd, letter by letter, from the right */
  const sdTl = gsap.timeline({ scrollTrigger: { trigger: '.sd', start: 'top top', end: '+=130%', scrub: true, pin: true } });
  sdTl.from(sdChars, { yPercent: 105, opacity: 0, duration: .3, stagger: .03, ease: 'expo.out' }, 0)
    .from(['.sd__l', '.sd__r', '.sd__logo', '.sd__menu'], { opacity: 0, y: 16, duration: .2, stagger: .04 }, .15);
  /* each letter crossfades into a pre-blurred twin: opacity + transform only, no live blur */
  sdChars.forEach((c, i) => {
    const k = i / (sdChars.length - 1), at = .45 + (1 - k) * .1, x = k * k * 90;
    sdTl.to($('b', c), { opacity: 1 - Math.min(1, k * 1.25), x, duration: .6, ease: 'power1.in' }, at)
      .to($('i', c), { opacity: k * .85, x: x * 1.3, duration: .6, ease: 'power1.in' }, at);
  });
  sdTl.fromTo('.sd__img', { scale: 1.12 }, { scale: 1, duration: 1.1, ease: 'none' }, 0);

  /* tram: the one-sheet prints — aqua frame first, then the still slides in, then the heavy red title rises */
  const trTl = gsap.timeline({ scrollTrigger: { trigger: '.tr', start: 'top 70%' } });
  trTl.from('.tr__poster', { clipPath: 'inset(0 50% 0 50%)', duration: 1.1, ease: 'expo.inOut' })
    .from('.tr__frame', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=.5')
    .from('.tr__tw', { yPercent: 100, duration: 1.1, ease: 'expo.out' }, '-=.6')
    .from('.tr__row span, .tr__star, .tr__kick, .tr__copy, .tr__laurels li, .tr__fl, .tr__fr', { opacity: 0, y: 10, duration: .6, stagger: .04, ease: 'power2.out' }, '-=.8');
  gsap.fromTo('.tr__img', { scale: 1.2, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.tr', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* the walk: the two halves part like tram doors, the line draws, you walk */
  gsap.timeline({ scrollTrigger: { trigger: '.sk', start: 'top 80%', end: 'top 10%', scrub: true } })
    .fromTo('.sk__top', { yPercent: 40 }, { yPercent: 0, ease: 'none' }, 0)
    .fromTo('.sk__bot', { yPercent: -40 }, { yPercent: 0, ease: 'none' }, 0)
    .from('.sk__band', { scaleY: .2, ease: 'none' }, 0)
    .from('.sk__rail', { scaleX: 0, ease: 'none' }, .2)
    .from('.sk__w', { opacity: 0, y: 30, stagger: .1, ease: 'none' }, .2);
  gsap.from('.sk__film, .sk__credits', { opacity: 0, y: 20, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.sk__bot', start: 'top 70%' } });

  /* last shows: the panel opens up as it arrives, then plays one night every 6 seconds while you look at it */
  gsap.fromTo(epPanel, { scale: .88 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: ep, start: 'top bottom', end: 'top 15%', scrub: true } });
  gsap.from(['.ep__kick', '.ep__title', '.ep__line', '.ep__num', '.ep__play'], { opacity: 0, y: 30, duration: 1.1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: ep, start: 'top 45%' } });
  gsap.from('.ep__list li', { opacity: 0, x: 40, duration: 1, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: ep, start: 'top 45%' } });
  gsap.to('.ep__ring', { rotation: 360, duration: 90, ease: 'none', repeat: -1 });
  ScrollTrigger.create({ trigger: ep, start: 'top 40%', end: 'bottom 30%', onToggle: (st) => { epLive = st.isActive; epAuto(); } });

  /* the end: focus pull */
  const endEl = $('.end');
  gsap.fromTo('.end__img--sharp', { opacity: 0 }, { opacity: .85, ease: 'none', scrollTrigger: { trigger: endEl, start: 'top bottom', end: 'center center', scrub: true } });
  gsap.from('.end__h', { scaleY: .4, opacity: 0, transformOrigin: 'bottom', ease: 'none', scrollTrigger: { trigger: endEl, start: 'top 80%', end: 'center 60%', scrub: true } });
  gsap.from('.ft__h', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 80%' } });
})();
