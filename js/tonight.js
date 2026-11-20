/* ═══════════════════════════════════════════════════════════════
   LAST SHOW — tonight
   which film, minute by minute, the weather for the walk
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

  /* ═══ which night: ?d=5 picks a weekday, otherwise the next show ═══ */
  const want = new URLSearchParams(location.search).get('d');
  let S = null;
  if (want != null && LS.WEEK[+want]) for (let k = 0; k < 7 && !S; k++) { const s = LS.show(k); if (s && s.dow === +want) S = s; }
  S = S || LS.show();
  const f = S.f;
  const day0 = Math.floor(LS.now() / 864e5) * 864e5;
  const diff = Math.round((S.day - day0) / 864e5);
  const label = diff <= 0 ? 'tonight' : diff === 1 ? 'tomorrow' : LS.DAYS[S.dow];
  const no = LS.ORDER.indexOf(S.dow) + 1;
  const ends = LS.ends(f);
  const spare = LS.TRAM - ends - LS.WALK;
  const seed = Math.floor(S.day / 864e5);
  const taken = 40 + ((seed * 7919) % 47);
  const left = 94 - taken;
  const d = new Date(S.day);
  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const nice = `${LS.DAYS[S.dow]}, ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;

  document.title = `${label} · ${f.title} — LAST SHOW`;
  put('when', `${label} · n°${LS.pad(no)}`);
  put('title', f.title);
  put('syn', f.syn);
  put('day', LS.DAYS[S.dow].slice(0, 3));
  put('no', LS.pad(no));
  put('left', `· ${left} left`);
  put('c1', f.cast[0]); put('c2', f.cast[1]);
  put('dir', f.dir);
  put('year', f.year);
  put('run', `${f.min} min · lights up ${LS.hm(ends)}`);
  put('genre', f.genre);
  put('pct', Math.round(taken / 94 * 100));
  put('lang', `${f.lang} · portuguese subtitles`);
  put('ratio', `${f.ar.toFixed(2)}:1`);
  put('seats', `${left} of 94`);
  put('wxwhen', `23:40 · ${nice}`);
  $('.tp__script').textContent = label;
  $$('.th__cta, .tw__btn').forEach(a => (a.href = `room.html?d=${S.dow}#seats`));
  /* every slot on this page gets its own photo of the film: 1 = trailer thumb, 2 = blurred backdrop, 3 = hero, 4 = poster, 5-7 = stills, 8 = film panel */
  $$('[data-film]').forEach(el => { const n = el.dataset.film; LS.setSlot(el, `HOME/film-${f.slug}${n === '1' ? '' : '-' + n}.jpg`, `${f.title}: a still from the film`, f.tone); });

  /* the countdown under the title */
  const countEl = $('[data-f="count"]');
  const tick = () => {
    const n = LS.now();
    let t;
    if (S.start - n > 864e5) t = `${plural(Math.floor((S.start - n) / 864e5), 'day')} to go · doors 23:00`;
    else if (n < S.day + LS.DOORS * 6e4) t = `${label === 'tonight' ? 'starts' : 'the film starts'} in ${LS.hms(S.start - n)}`;
    else if (n < S.start) t = `doors are open · film in ${LS.hms(S.start - n)}`;
    else if (n < S.end) t = `now showing · ends in ${LS.hms(S.end - n)}`;
    else t = `lights are up · last 28 in ${LS.hms(S.tram - n)}`;
    countEl.textContent = t;
  };
  tick(); setInterval(tick, 1000);

  /* ═══ 03 · the film: a roll of facts, and a trailer button that refuses ═══ */
  const ROLL = [
    ['actors', f.cast.join(', ')],
    ['format', `35mm print · ${f.ar.toFixed(2)}:1`],
    ['language', `${f.lang}, portuguese subtitles`],
    ['rated', 'm/12 · nobody late gets in']
  ];
  const dots = $$('.tj__dots li');
  let rOn = -1, rTimer = null;
  const roll = (i, anim = true) => {
    i = (i + ROLL.length) % ROLL.length;
    rOn = i;
    dots.forEach((x, k) => x.classList.toggle('is-on', k === i));
    const set = () => { put('rn', LS.pad(i + 1)); put('rk', ROLL[i][0]); put('rv', ROLL[i][1]); };
    const kids = $$('.tj__item > *');
    if (!G || !anim) return set();
    gsap.to(kids, { opacity: 0, y: -10, duration: .2, stagger: .03, ease: 'power2.in', onComplete: () => {
      set();
      gsap.fromTo(kids, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'expo.out' });
    } });
  };
  const rPlay = () => { clearInterval(rTimer); rTimer = setInterval(() => roll(rOn + 1), 3400); };
  dots.forEach((x, k) => x.addEventListener('click', () => { roll(k); rPlay(); }));
  roll(0, false); rPlay();

  const tr = $('.tj__trailer'), trl = $('.tj__tl');
  let trT = null;
  tr.addEventListener('click', () => {
    tr.classList.add('is-no');
    trl.innerHTML = 'we don’t do trailers.<br>come at 23:40.';
    clearTimeout(trT);
    trT = setTimeout(() => { tr.classList.remove('is-no'); trl.textContent = 'watch trailer'; }, 3200);
  });

  /* ═══ 04 · the night, in order ═══ */
  const STEPS = [
    ['23:00', 'doors open.', 'the bar opens with the doors. tickets are checked by hand, by the same person every night, who will know your face by the second visit.', 'doors', 'the cinema doors on rua da rosa, open, warm light inside', 'amber'],
    ['23:30', 'the bar closes.', 'last bica, last ginjinha. the room fills from the back. phones go dark at 23:35, or the usher asks you nicely.', 'counter', 'the bar counter after closing, cups upside down', 'tungsten'],
    ['23:40', 'lights down.', 'no trailers, no ads, no second bell. the film starts on the minute and the door closes behind it.', 'dark', 'the room in the dark, only the beam from the booth', 'night'],
    [LS.hm(ends), 'lights up.', `${f.min} minutes later. we leave the credits running. stay if you can: tonight you have ${plural(Math.max(0, spare), 'minute')} to spare.`, 'credits', 'the credits on the screen, three people still sitting', 'velvet'],
    ['01:52', 'the last 28.', spare >= 0 ? `camões, three minutes downhill. you make it with ${plural(spare, 'minute')} left, if you leave on the last frame.` : 'camões, three minutes downhill. tonight the film runs long, so we hold the doors until you are all out.', 'tram', 'the yellow 28 at camões at night, doors open', 'street']
  ];
  const stepImg = $('.tw__stepimg');
  const stepKids = () => [$('[data-f="sh"]'), $('[data-f="sp"]')];
  let sOn = -1, sTimer = null, sLive = false;
  const step = (i, anim = true) => {
    i = (i + STEPS.length) % STEPS.length;
    sOn = i;
    const [t, h, p, img, note, tone] = STEPS[i];
    const set = () => {
      put('sn', LS.pad(i + 1)); put('st', t); put('sh', h); put('sp', p);
      LS.setSlot(stepImg, `TONIGHT/${img}.jpg`, note, tone);
    };
    if (!G || !anim) return set();
    gsap.to(stepKids(), { opacity: 0, y: -10, duration: .2, stagger: .03, ease: 'power2.in', onComplete: () => {
      set();
      gsap.fromTo(stepKids(), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'expo.out' });
    } });
  };
  const sPlay = () => { clearInterval(sTimer); if (sLive) sTimer = setInterval(() => step(sOn + 1), 4200); };
  $('.tw__next').addEventListener('click', () => { step(sOn + 1); sPlay(); });
  step(0, false);

  /* ═══ 05 · the weather at 23:40 (open-meteo, no key). offline: a calm lisbon night ═══ */
  const nights = $('.wx__nights');
  nights.innerHTML = LS.ORDER.filter(k => LS.WEEK[k] && k !== S.dow).map(k =>
    `<li><a href="tonight.html?d=${k}" data-cur="${LS.DAYS[k]}">${LS.WEEK[k].title}<small>${LS.DAYS[k].slice(0, 3)}</small></a></li>`).join('');
  const ICONS = {
    clear: '<path d="M26 8a13 13 0 1 0 8 20A11 11 0 0 1 26 8z"/>',
    cloud: '<path d="M12 30h17a7 7 0 0 0 0-14 10 10 0 0 0-19 3 6 6 0 0 0 2 11z"/>',
    rain: '<path d="M12 24h17a7 7 0 0 0 0-14 10 10 0 0 0-19 3 6 6 0 0 0 2 11z"/><path d="M14 28l-2 6M20 28l-2 6M26 28l-2 6"/>',
    fog: '<path d="M8 14h24M5 20h30M8 26h24M12 32h16"/>',
    storm: '<path d="M12 22h17a7 7 0 0 0 0-14 10 10 0 0 0-19 3 6 6 0 0 0 2 11z"/><path d="M21 24l-4 7h6l-4 7"/>'
  };
  const kind = (c) => c === 0 ? ['clear', 'clear'] : c <= 2 ? ['clear', 'a few clouds'] : c === 3 ? ['cloud', 'cloudy'] : c <= 48 ? ['fog', 'fog'] : c >= 95 ? ['storm', 'storm'] : ['rain', c >= 80 ? 'showers' : c >= 61 ? 'rain' : 'drizzle'];
  const wx = (w) => {
    const [ic, word] = kind(w.code);
    $('.wx__icon').innerHTML = ICONS[ic];
    put('cond', word);
    countTo($('[data-f="temp"]'), w.temp);
    put('cloud', w.cloud == null ? '—' : `${w.cloud}%`);
    put('rain', w.rain == null ? '—' : `${w.rain}%`);
    put('wind', w.wind == null ? '—' : `${w.wind} km/h`);
    put('tip', w.rain >= 40 ? 'take an umbrella for the walk to camões. the 28 waits for no one.'
      : w.temp < 12 ? 'bring a jacket. the 28 isn’t heated and the hill is windy.'
      : w.wind > 25 ? 'it’s windy on the miradouro. hold on to your ticket.'
      : 'a good night to walk the long way, past santa catarina.');
  };
  let wxDone = false;
  const countTo = (el, v) => {
    if (!G || RM || wxDone) { el.textContent = v; return; }
    const o = { v: 0 };
    gsap.to(o, { v, duration: 1.4, ease: 'expo.out', onUpdate: () => (el.textContent = Math.round(o.v)) });
  };
  const iso = `${d.getUTCFullYear()}-${LS.pad(d.getUTCMonth() + 1)}-${LS.pad(d.getUTCDate())}`;
  let wxData = { temp: [15, 15, 16, 18, 20, 23, 25, 25, 23, 20, 17, 15][d.getUTCMonth()], code: 1, cloud: null, rain: null, wind: null };
  const wxReady = fetch(`https://api.open-meteo.com/v1/forecast?latitude=38.713&longitude=-9.146&hourly=temperature_2m,precipitation_probability,cloud_cover,wind_speed_10m,weather_code&timezone=Europe%2FLisbon&start_date=${iso}&end_date=${iso}`)
    .then(r => (r.ok ? r.json() : Promise.reject()))
    .then(j => {
      const h = j.hourly, i = h.time.findIndex(t => t.endsWith('T23:00'));
      if (i < 0) return;
      wxData = { temp: Math.round(h.temperature_2m[i]), code: h.weather_code[i], cloud: h.cloud_cover[i], rain: h.precipitation_probability[i], wind: Math.round(h.wind_speed_10m[i]) };
    })
    .catch(() => {});
  wxDone = true; wx(wxData); wxDone = !G || RM;

  /* ═══ motion ═══ */
  const split = (el, cls) => { el.innerHTML = el.textContent.split(' ').map(w => `<span class="${cls}">${w}</span>`).join(' '); return $$('.' + cls, el); };
  const chars = (el) => { el.innerHTML = el.textContent.split(' ').map(w => `<span class="wd">${[...w].map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' '); return $$('.ch', el); };
  const synW = split($('.th__syn'), 'w');
  const tpC = chars($('.tp__word'));
  const bbT = $('.bb__title');
  bbT.innerHTML = bbT.innerHTML.split('<br>').map(l => `<span class="ln"><span>${l}</span></span>`).join('');

  if (!G || RM) { wxReady.then(() => wx(wxData)); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* 01 · the title rises, the face settles */
  gsap.set('.th__ln > span', { yPercent: 110 });
  gsap.set(synW, { yPercent: 60, opacity: 0 });
  gsap.set(['.th__about', '.th__no', '.th__foot'], { opacity: 0, y: 14 });
  gsap.set('.th__img', { scale: 1.14 });
  LS.ready.then(() => {
    gsap.timeline()
      .to('.th__img', { scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
      .to('.th__ln > span', { yPercent: 0, duration: 1.2, stagger: .12, ease: 'expo.out' }, .15)
      .to(['.th__about', '.th__no'], { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, .6)
      .to(synW, { yPercent: 0, opacity: 1, duration: .8, stagger: .018, ease: 'expo.out' }, .65)
      .to('.th__foot', { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, 1.1);
  });
  gsap.to('.th__img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.th', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.th__title', { y: -120, ease: 'none', scrollTrigger: { trigger: '.th', start: 'top top', end: 'bottom top', scrub: true } });

  /* 02 · the poster assembles */
  gsap.fromTo('.tp__box', { scale: .86 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.tp__box', start: 'top bottom', end: 'center 55%', scrub: true } });
  gsap.fromTo('.tp__pic', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.tp__box', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.tp__cast span', { opacity: 0, y: 20, duration: 1, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '.tp__frame', start: 'top 75%' } });
  gsap.timeline({ scrollTrigger: { trigger: '.tp__title', start: 'top 85%' } })
    .from(tpC, { yPercent: 70, opacity: 0, duration: 1, stagger: .045, ease: 'expo.out' })
    .from('.tp__script', { opacity: 0, x: -40, rotation: -6, duration: 1.4, ease: 'expo.out' }, .45);
  gsap.from('.tp__still', { opacity: 0, y: 40, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.tp__stills', start: 'top 90%' } });
  gsap.from('.tp__by', { opacity: 0, y: 16, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.tp__by', start: 'top 95%' } });

  /* 03 · the film panel opens */
  gsap.fromTo('.tj__panel', { scale: .88 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.tj', start: 'top bottom', end: 'top 10%', scrub: true } });
  gsap.fromTo('.tj__img > img', { yPercent: -6, scale: 1.15 }, { yPercent: 6, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.tj', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from(['.tj__title', '.tj__syn', '.tj__more'], { opacity: 0, y: 30, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.tj__panel', start: 'top 55%' } });
  gsap.from('.tj__facts dl > div, .tj__follow', { opacity: 0, x: 24, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.tj__panel', start: 'top 55%' } });

  /* 04 · the card arrives, the floating cards drift at their own speed */
  gsap.fromTo('.tw__card', { scale: .9 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.tw__stage', start: 'top bottom', end: 'top 25%', scrub: true } });
  [['.tw__f--a', 140], ['.tw__f--seats', 90], ['.tw__f--dots', 60], ['.tw__f--b', -110], ['.tw__f--aa', -160]].forEach(([s, v]) =>
    gsap.fromTo(s, { y: v }, { y: -v, ease: 'none', scrollTrigger: { trigger: '.tw__stage', start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.tw__title', { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.tw__card', start: 'top 70%' } });
  ScrollTrigger.create({ trigger: '.tw__f--seats', start: 'top 85%', once: true, onEnter: () => countTo($('[data-f="pct"]'), Math.round(taken / 94 * 100)) });
  ScrollTrigger.create({ trigger: '.tw__step', start: 'top 85%', end: 'bottom top', onToggle: (st) => { sLive = st.isActive; sLive ? sPlay() : clearInterval(sTimer); } });

  /* 05 · the weather: the window drifts, the numbers arrive */
  gsap.fromTo('.wx__img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.wx', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.wx__nights li, .wx__dl > div', { opacity: 0, x: 20, duration: .9, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '.wx__panel', start: 'top 60%' } });
  ScrollTrigger.create({ trigger: '.wx__panel', start: 'top 60%', once: true, onEnter: () => wxReady.then(() => { wx(wxData); wxDone = true; }) });

  /* 06 · the bar: the cup turns as you scroll past */
  gsap.from('.bb__title .ln > span', { yPercent: 105, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.bb', start: 'top 60%' } });
  gsap.from(['.bb__n', '.bb__txt', '.bb__menu li'], { opacity: 0, y: 20, duration: 1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.bb', start: 'top 60%' } });
  gsap.fromTo('.bb__cup', { '--r': '-24deg' }, { '--r': '14deg', ease: 'none', scrollTrigger: { trigger: '.bb', start: 'top bottom', end: 'bottom top', scrub: true } });
})();
