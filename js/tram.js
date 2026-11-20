/* ═══════════════════════════════════════════════════════════════
   LAST SHOW — the tram
   the countdown to 01:52, the ride to prazeres, the sunrise if you miss it
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const LS = window.LS;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const G = !!window.gsap && !!window.ScrollTrigger;
  const RM = LS.RM;
  const put = (k, v) => $$(`[data-f="${k}"]`).forEach(el => (el.textContent = v));

  /* ═══ the night we mean: the next show's last tram ═══ */
  const S = LS.show();
  const day0 = Math.floor(LS.now() / 864e5) * 864e5;
  const diff = Math.round((S.day - day0) / 864e5);
  put('today', diff <= 0 ? 'tonight' : diff === 1 ? 'tomorrow night' : LS.DAYS[S.dow]);
  put('date', LS.date(LS.now()));
  const countEl = $('[data-f="count"]');
  const tick = () => {
    const n = LS.now(), left = S.tram - n;
    countEl.textContent = left > 864e5 ? `${Math.floor(left / 864e5)}d ${LS.hms(left % 864e5)}` : LS.hms(left);
  };
  tick(); setInterval(tick, 1000);

  /* ═══ the route after camões ═══ */
  const STOPS = [['camões', '01:52', 0], ['calçada do combro', '01:54', .2], ['são bento', '01:56', .4], ['estrela', '01:59', .6], ['campo de ourique', '02:02', .8], ['prazeres', '02:05', 1]];
  const LINES = ['the doors close at 01:52 sharp', 'the hill starts here. hold on', 'past the parliament, lights still on', 'the basilica, the garden, the bell', 'the long straight. someone always falls asleep', 'end of the line. the cemetery is very quiet'];
  const stopsEl = $('.kd__stops');
  stopsEl.innerHTML = STOPS.map(([n, t, p]) => `<li style="left:${p * 100}%"><b>${t}</b><span>${n}</span></li>`).join('');
  const lis = $$('li', stopsEl);
  let sOn = -1;
  const at = (p) => {
    const i = Math.min(STOPS.length - 1, Math.round(p * (STOPS.length - 1)));
    if (i === sOn) return;
    sOn = i;
    lis.forEach((li, k) => li.classList.toggle('is-on', k === i));
    put('stop', `${STOPS[i][1]} · ${STOPS[i][0]} · ${LINES[i]}`);
  };
  at(0);

  /* ═══ the sunrise the morning after (open-meteo, no key) ═══ */
  const morning = new Date(S.day + 864e5);
  const iso = `${morning.getUTCFullYear()}-${LS.pad(morning.getUTCMonth() + 1)}-${LS.pad(morning.getUTCDate())}`;
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=38.713&longitude=-9.146&daily=sunrise&timezone=Europe%2FLisbon&start_date=${iso}&end_date=${iso}`)
    .then(r => (r.ok ? r.json() : Promise.reject()))
    .then(j => { const t = j.daily && j.daily.sunrise && j.daily.sunrise[0]; if (t) put('sunrise', t.slice(11, 16)); })
    .catch(() => {});

  /* ═══ motion ═══ */
  const chars = (el) => { el.innerHTML = [...el.textContent].map(c => `<span class="ch">${c}</span>`).join(''); return $$('.ch', el); };
  if (!G || RM) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 01 · the seats drift, the countdown arrives */
  gsap.from('.kd__over > *', { opacity: 0, y: 20, duration: 1, stagger: .1, ease: 'expo.out', delay: .3 });
  gsap.fromTo('.kd__top .kd__img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.kd__top', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.fromTo('.kd__bot .kd__img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.kd__bot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* the band: the words come in, the rail draws, the 28 runs the route as you scroll */
  gsap.timeline({ scrollTrigger: { trigger: '.kd__band', start: 'top 75%' } })
    .from(chars($('.kd__w--a')), { yPercent: 100, opacity: 0, duration: 1, stagger: .04, ease: 'expo.out' }, 0)
    .from(chars($('.kd__w--b')), { yPercent: 100, opacity: 0, duration: 1, stagger: .04, ease: 'expo.out' }, .1)
    .from('.kd__rail', { scaleX: 0, duration: 1.3, ease: 'expo.inOut' }, .1)
    .from(lis, { opacity: 0, y: 12, duration: .8, stagger: .06, ease: 'expo.out' }, .5);
  const track = $('.kd__track');
  gsap.fromTo('.kd__tram', { x: 0 }, { x: () => track.clientWidth, ease: 'none', scrollTrigger: { trigger: '.kd__band', start: 'top 60%', end: 'bottom 30%', scrub: .4, invalidateOnRefresh: true, onUpdate: (st) => at(st.progress) } });

  /* the driver, the credits */
  gsap.from(['.kd__film', '.kd__credits', '.kd__logos'], { opacity: 0, y: 24, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.kd__bot', start: 'top 55%' } });

  /* 02 · the sunrise poster: lands, then the huge word rises */
  gsap.fromTo('.su__poster', { scale: .9 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.su', start: 'top bottom', end: 'top 10%', scrub: true } });
  gsap.fromTo('.su__img', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.su', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.timeline({ scrollTrigger: { trigger: '.su__poster', start: 'top 55%' } })
    .from('.su__title span', { yPercent: 100, duration: 1.2, ease: 'expo.out' }, 0)
    .from(['.su__ins', '.su__syn', '.su__laurels li', '.su__star', '.su__row'], { opacity: 0, y: 12, duration: .9, stagger: .06, ease: 'expo.out' }, .2);
})();
