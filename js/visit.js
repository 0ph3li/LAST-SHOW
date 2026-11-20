/* ═══════════════════════════════════════════════════════════════
   LAST SHOW — visit
   where we are, the way up, what to know, your night
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
  const day0 = () => Math.floor(LS.now() / 864e5) * 864e5;

  /* ═══ 01 · the hours, live ═══ */
  const nextLine = () => {
    const S = LS.show(), n = LS.now();
    const doors = S.day + LS.DOORS * 6e4;
    const d = Math.round((S.day - day0()) / 864e5);
    const when = d <= 0 ? 'tonight' : d === 1 ? 'tomorrow' : LS.DAYS[S.dow];
    const t = S.f.title;
    if (S.state === 'live') return `right now: ${t} is on. the door is closed until ${LS.hm(LS.ends(S.f))}.`;
    if (S.state === 'run') return `the film is over. everyone is running for the 28.`;
    if (S.state === 'doors') return `the doors are open. ${t} starts in ${Math.ceil((S.start - n) / 6e4)} min.`;
    const m = Math.ceil((doors - n) / 6e4), h = Math.floor(m / 60);
    return `the next one: ${t}, ${when}. doors in ${h ? h + 'h ' : ''}${m % 60}m.`;
  };
  const clock = () => { put('next', nextLine()); put('clock', 'lisboa ' + LS.hm(Math.floor(LS.now() / 6e4))); };
  clock(); setInterval(clock, 15000);

  /* the seat you held on room.html */
  const heldRaw = LS.get('held', null);
  const held = heldRaw && heldRaw.day >= day0() && LS.WEEK[new Date(heldRaw.day).getUTCDay()] ? heldRaw : null;
  put('held-n', held ? '1' : '0');

  /* the search pill: where are you? */
  const PLACES = {
    'chiado': ['5′', 'up rua da misericórdia, left on travessa da queimada.'],
    'príncipe real': ['6′', 'downhill for once: rua d. pedro v, then left into rua da rosa.'],
    'cais do sodré': ['14′', 'the elevador da bica up, then rua do loreto.'],
    'baixa': ['12′', 'the elevador da glória from restauradores, then west.'],
    'rossio': ['11′', 'the elevador da glória, then rua d. pedro v.'],
    'alfama': ['25′', 'or the 28 to camões, then four minutes up.'],
    'graça': ['30′', 'the 28 the whole way down to camões, then four minutes up.'],
    'martim moniz': ['28′', 'the 28 starts there. ride it to camões.'],
    'estrela': ['15′', 'the 28 towards camões, three stops.'],
    'campo de ourique': ['18′', 'the 28 from prazeres to camões. the same tram takes you home.'],
    'santos': ['15′', 'uphill all the way. or the bica.'],
    'belém': ['40′', 'the 15e to cais do sodré, the bica up, rua do loreto.'],
    'avenida': ['15′', 'metro to baixa-chiado, then camões.'],
    'marquês de pombal': ['18′', 'metro to baixa-chiado, then camões.'],
    'intendente': ['26′', 'metro to baixa-chiado, then camões.'],
    'bairro alto': ['2′', 'you’re here. follow the noise, then the quiet.'],
  };
  $('#bc-places').innerHTML = Object.keys(PLACES).map(p => `<option value="${p}">`).join('');
  const ans = $('.bc__ans');
  const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const answer = (v) => {
    v = strip(v);
    if (!v) { ans.classList.remove('is-on'); return; }
    const k = Object.keys(PLACES).find(p => strip(p).startsWith(v) || v.startsWith(strip(p)));
    ans.innerHTML = k ? `from ${k}: <b>${PLACES[k][0]}</b> on foot. ${PLACES[k][1]}` : `we don’t know “${v.replace(/[<>&"]/g, '')}”. get to largo de camões, then <b>4′</b> up rua da rosa.`;
    ans.classList.add('is-on');
  };
  const inp = $('.bc__search input');
  inp.addEventListener('change', () => answer(inp.value));
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') answer(inp.value); });

  /* ═══ 02 · the map of the bairro (schematic) ═══ */
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, txt) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (txt) n.textContent = txt; return n; };
  const STREETS = [
    ['190,70 210,300 195,570', 'rua do século', 178, 330, true],
    ['340,70 340,570', 'rua da rosa', 326, 470, true, 'main'],
    ['460,70 460,570', 'rua da atalaia', 446, 470, true],
    ['580,70 580,570', 'rua do diário de notícias', 566, 520, true],
    ['700,70 700,570', 'rua do norte', 686, 470, true],
    ['830,60 800,590', 'rua da misericórdia', 836, 450, true, 'main'],
    ['150,70 870,70', 'rua d. pedro v', 520, 58, false, 'main'],
    ['200,200 825,200', 'rua da barroca', 520, 192, false],
    ['205,330 815,330', 'travessa da queimada', 520, 322, false],
    ['340,450 700,450', 'travessa da água da flor', 520, 442, false],
    ['150,570 790,570', 'rua do loreto', 560, 562, false, 'main'],
    ['420,570 400,690', '', 0, 0],
    ['770,605 905,640', '', 0, 0],
  ];
  const g = $('.wy__streets');
  STREETS.forEach(([pts, name, x, y, vert, cls]) => {
    g.appendChild(el('polyline', { points: pts, class: cls || '' }));
    if (name) g.appendChild(el('text', { x, y, transform: vert ? `rotate(-90 ${x} ${y})` : '', 'text-anchor': 'middle' }, name));
  });
  [[770, 605, 'largo de camões · the 28', 735, 640], [905, 640, 'metro baixa-chiado', 905, 668], [880, 70, 'miradouro · elevador da glória', 880, 40], [400, 690, 'elevador da bica ↓ the river', 400, 715]].forEach(([cx, cy, t, tx, ty]) => {
    g.appendChild(el('circle', { cx, cy, r: 6, class: 'dot' }));
    g.appendChild(el('text', { x: tx, y: ty, 'text-anchor': 'middle' }, t));
  });
  g.appendChild(el('text', { x: 262, y: 300, class: 'big', 'text-anchor': 'end' }, 'LAST SHOW · 113'));
  const pin = $('.wy__pin'); pin.setAttribute('transform', 'translate(340 320)');

  const WAYS = [
    { k: 'from the 28', min: 4, from: 'from the 28 at largo de camões', d: 'M770,605 L760,570 L340,570 L340,320',
      steps: ['get off the 28 at <b>largo de camões</b>, the square with the poet in the middle.', 'cross to <b>rua do loreto</b> and follow it west, away from the river, past the bica funicular.', 'turn right into <b>rua da rosa</b> and climb. a red door, 113, a light on above it.'] },
    { k: 'from the metro', min: 7, from: 'from baixa-chiado (blue and green lines)', d: 'M905,640 L770,605 L760,570 L340,570 L340,320',
      steps: ['take the <b>chiado</b> exit (the long escalators, then the stairs) and walk up to <b>largo de camões</b>.', 'cross the square to <b>rua do loreto</b>, west, two long blocks.', 'right into <b>rua da rosa</b>, uphill to 113.'] },
    { k: 'from the glória', min: 6, from: 'from the top of the elevador da glória', d: 'M880,70 L340,70 L340,320',
      steps: ['ride the <b>elevador da glória</b> up from restauradores. or walk it: steep and short.', 'at the top, look back at the castle once, then follow <b>rua d. pedro v</b> west.', 'left down <b>rua da rosa</b>. downhill for once. the red door, 113.'] },
    { k: 'from the river', min: 14, from: 'from cais do sodré', d: 'M400,690 L420,570 L340,570 L340,320',
      steps: ['from <b>cais do sodré</b> walk to rua de são paulo and take the <b>elevador da bica</b> up.', 'at the top, left on <b>rua do loreto</b>, then right at the first corner.', 'that’s <b>rua da rosa</b>. up to 113. you’ve earned a bica at the bar.'] },
  ];
  const tabs = $('.wy__tabs'), route = $('.wy__route'), you = $('.wy__you'), ol = $('.wy__steps ol');
  tabs.innerHTML = WAYS.map((w, i) => `<button type="button" role="tab" class="bc__pill${i ? '' : ' is-on'}" data-w="${i}" data-cur="${w.min} min">${w.k}</button>`).join('');
  let wOn = -1, drawTw;
  const way = (i, animate = true) => {
    if (i === wOn) return;
    wOn = i;
    const w = WAYS[i];
    $$('button', tabs).forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-selected', k === i); });
    put('min', w.min + '′'); put('from', w.from);
    ol.innerHTML = w.steps.map(s => `<li><span>${s}</span></li>`).join('');
    route.setAttribute('d', w.d);
    const L = route.getTotalLength();
    route.style.strokeDasharray = L;
    const place = (p) => { const pt = route.getPointAtLength(L * p); you.setAttribute('cx', pt.x); you.setAttribute('cy', pt.y); route.style.strokeDashoffset = L * (1 - p); };
    if (drawTw) drawTw.kill();
    if (!G || RM || !animate) { place(1); return; }
    const o = { p: 0 };
    place(0);
    drawTw = gsap.to(o, { p: 1, duration: 1.1 + w.min * .08, ease: 'power2.inOut', onUpdate: () => place(o.p) });
    gsap.from($$('li', ol), { opacity: 0, y: 10, duration: .7, stagger: .08, ease: 'expo.out' });
  };
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-w]'); if (b) way(+b.dataset.w); });
  way(0, false);

  /* ═══ 03 · before you come ═══ */
  const NOTES = [
    ['late', ['Doors:', '23:00', 'Close:', '23:40'], 'the door closes when the lights go down, and it stays closed. the film doesn’t wait, and neither does the 28. come early, have a bica.'],
    ['language', ['Sound:', 'original', 'Subs:', 'english'], 'every film in its own language with english subtitles. on thursdays the subtitles are portuguese. nothing is ever dubbed.'],
    ['the step', ['Door:', 'one step', 'Ramp:', 'yes'], 'there is one step at the red door and a ramp we put out when you knock. row j has room for two wheelchairs, and the toilet is on the same floor.'],
    ['the bar', ['Opens:', '23:00', 'Last:', '23:35'], 'bica, ginjinha, vinho verde by the glass and popcorn made at half past ten. you can take your glass in. please take it back out.'],
    ['phones', ['Screen:', 'dark', 'Sound:', 'off'], 'off, not on silent. the usher has a torch and has used it. if you need to be reachable, sit at the end of a row and step out.'],
    ['the room for you', ['Mornings:', 'yes', 'From:', '€180'], 'private screenings in the morning, with your film and your people, up to 94. birthdays, proposals, one person alone. <a href="mailto:hello@lastshow.pt" data-cur="write">write to us</a>.'],
  ];
  $('.bf__grid').innerHTML = NOTES.map(([t, d, p], i) => `<article class="bf__it"><dl><div><dt>N:</dt><dd>0${i + 1}</dd></div><div><dt>${d[0]}</dt><dd>${d[1]}</dd><dt>${d[2]}</dt><dd>${d[3]}</dd></div></dl><h3>${t}</h3><p>${p}</p></article>`).join('');

  /* ═══ 04 · your night ═══ */
  let N;
  if (held) {
    const dow = new Date(held.day).getUTCDay();
    N = { f: LS.WEEK[dow], dow, day: held.day, seat: held.seat };
  } else {
    const S = LS.show();
    N = { f: S.f, dow: S.dow, day: S.day, seat: null };
  }
  const nd = Math.round((N.day - day0()) / 864e5);
  put('title', N.f.title);
  put('night', `${nd <= 0 ? 'tonight, ' : nd === 1 ? 'tomorrow, ' : ''}${LS.DAYS[N.dow]} ${LS.date(N.day)}`);
  put('end', LS.hm(LS.ends(N.f)));
  const spare = LS.TRAM - LS.ends(N.f) - LS.WALK;
  put('spare', spare >= 0 ? `${plural(spare, 'minute')} to spare` : 'we hold the doors');
  put('seat', N.seat ? `${N.seat}, held until 23:30` : 'none held yet');
  const sl = $('[data-f="seatlink"]');
  sl.href = `room.html?d=${N.dow}#seats`; sl.textContent = N.seat ? 'change seat' : 'pick a seat';
  $('[data-f="filmlink"]').href = `tonight.html?d=${N.dow}`;
  LS.setSlot($('.yn__out'), `HOME/film-${N.f.slug}-7.jpg`, `a still from ${N.f.title}`, 'duo');

  /* the night in your calendar (.ics, made here, nothing sent anywhere) */
  $('[data-ics]').addEventListener('click', () => {
    const d = new Date(N.day), ymd = `${d.getUTCFullYear()}${LS.pad(d.getUTCMonth() + 1)}${LS.pad(d.getUTCDate())}`;
    const e = new Date(N.day + LS.ends(N.f) * 6e4), ymd2 = `${e.getUTCFullYear()}${LS.pad(e.getUTCMonth() + 1)}${LS.pad(e.getUTCDate())}`;
    const hm = LS.hm(LS.ends(N.f)).replace(':', '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LAST SHOW//lisboa//EN', 'BEGIN:VEVENT',
      `UID:${ymd}-${N.f.slug}@lastshow.pt`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART;TZID=Europe/Lisbon:${ymd}T230000`, `DTEND;TZID=Europe/Lisbon:${ymd2}T${hm}00`,
      `SUMMARY:LAST SHOW · ${N.f.title}`, 'LOCATION:LAST SHOW\\, rua da rosa 113\\, bairro alto\\, lisboa',
      `DESCRIPTION:doors 23:00\\, film 23:40.${N.seat ? ' seat ' + N.seat + ' (say it at the door before 23:30).' : ''} the last 28 leaves camões at 01:52.`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `last-show-${N.f.slug}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  /* ═══ motion ═══ */
  if (!G || RM) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 01 · the panel arrives, the facts line up, the figure comes into focus as you scroll */
  gsap.timeline({ delay: .2 })
    .from('.bc__panel', { scale: .94, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0)
    .from('.bc__top > *', { opacity: 0, y: -8, duration: .9, stagger: .08, ease: 'expo.out' }, .4)
    .from('.bc__col dl > div', { opacity: 0, y: 8, duration: .8, stagger: .03, ease: 'expo.out' }, .55)
    .from('.bc__col p', { opacity: 0, y: 14, duration: 1, stagger: .1, ease: 'expo.out' }, .8)
    .from('.bc__trip li', { opacity: 0, y: 30, duration: 1.1, stagger: .09, ease: 'expo.out' }, .7)
    .from('.bc__foot', { opacity: 0, duration: 1 }, 1);
  const bcST = { trigger: '.bc', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.bc__blur', { opacity: 0, ease: 'none', scrollTrigger: { ...bcST, end: '60% top' } });
  gsap.to('.bc__panel', { yPercent: 8, scale: .97, ease: 'none', scrollTrigger: bcST });
  gsap.fromTo('.bc__out', { scale: 1.08 }, { scale: 1.2, ease: 'none', scrollTrigger: bcST });
  if (LS.FINE) {
    const fx = gsap.quickTo('.bc__fig', 'x', { duration: 1.2, ease: 'power3' }), fy = gsap.quickTo('.bc__fig', 'y', { duration: 1.2, ease: 'power3' });
    $('.bc').addEventListener('mousemove', (e) => { fx((e.clientX / innerWidth - .5) * -26); fy((e.clientY / innerHeight - .5) * -18); });
  }

  /* 02 · the panel rises, the route draws itself */
  gsap.fromTo('.wy__out', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.wy', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.wy__panel', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.wy', start: 'top 70%' } });
  gsap.from('.wy__streets > *', { opacity: 0, duration: .6, stagger: .015, ease: 'none', scrollTrigger: { trigger: '.wy__map', start: 'top 70%', onEnter: () => { wOn = -1; way(0); } } });

  /* 03 · the room behind drifts, the six notes come in */
  gsap.fromTo('.bf__bg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.bf', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.bf__h', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.bf', start: 'top 65%' } });
  ScrollTrigger.batch('.bf__it', { start: 'top 85%', once: true, onEnter: (els) => gsap.from(els, { opacity: 0, y: 40, duration: 1.1, stagger: .1, ease: 'expo.out' }) });

  /* 04 · your night */
  gsap.fromTo('.yn__out', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.yn', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.timeline({ scrollTrigger: { trigger: '.yn', start: 'top 60%' } })
    .from('.yn__panel', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0)
    .from('.yn__dl > div', { opacity: 0, x: -10, duration: .8, stagger: .06, ease: 'expo.out' }, .3)
    .from('.yn__cta > *', { opacity: 0, y: 10, duration: .8, stagger: .07, ease: 'expo.out' }, .6);
})();
