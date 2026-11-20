/* ═══════════════════════════════════════════════════════════════
   LAST SHOW — shared engine (window.LS)
   concept, design & code by ghostly.grl ♥

   lisbon clock, the week, tonight's show, image slots, loader,
   cursor, lenis, bar, scramble, magnetic, house lights (L / konami),
   tab title, console
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const LS = (window.LS = {});
  const RM = (LS.RM = matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FINE = (LS.FINE = matchMedia('(hover: hover) and (pointer: fine)').matches);
  const $ = (LS.$ = (s, r = document) => r.querySelector(s));
  const $$ = (LS.$$ = (s, r = document) => [...r.querySelectorAll(s)]);
  const G = () => !!window.gsap;

  LS.get = (k, d) => { try { const v = localStorage.getItem('ls-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  LS.set = (k, v) => { try { localStorage.setItem('ls-' + k, JSON.stringify(v)); } catch (e) {} };

  /* ═══════════════ the house rules, in numbers ═══════════════ */
  LS.START = 23 * 60 + 40;   // the film starts at 23:40, no trailers
  LS.DOORS = 23 * 60;        // doors at 23:00
  LS.TRAM = 25 * 60 + 52;    // the last 28 leaves camões at 01:52
  LS.WALK = 3;               // cinema → camões, downhill, if you run

  /* the week, by js weekday (0 = sunday). monday the screen rests. */
  LS.WEEK = {
    2: { slug: 'perfect-days', title: 'perfect days', year: 2023, dir: 'wim wenders', min: 124, ar: 1.33, tone: 'green',
         cast: ['kōji yakusho', 'arisa nakano'], genre: 'drama', lang: 'japanese, english',
         syn: 'a man in tokyo cleans public toilets, plays cassettes in his van and photographs the same trees every lunch break. every day is the same day, and none of them is.',
         q: [['i bought a cassette on the way to the tram.', 'row c · regular since 2019'], ['the most peaceful two hours of my year.', 'seat d4']] },
    3: { slug: 'in-the-mood-for-love', title: 'in the mood for love', year: 2000, dir: 'wong kar-wai', min: 98, ar: 1.66, tone: 'neon',
         cast: ['maggie cheung', 'tony leung'], genre: 'romance', lang: 'cantonese',
         syn: 'hong kong, 1962. two neighbours find out that their partners are seeing each other. they decide they will never be like them, and spend the film almost failing.',
         q: [['i didn’t breathe for 98 minutes.', 'row b'], ['we sat apart. we walked home together.', 'seats e9 & e10']] },
    4: { slug: 'talk-to-me', title: 'talk to me', year: 2023, dir: 'danny & michael philippou', min: 95, ar: 2.39, tone: 'neon',
         cast: ['sophie wilde', 'alexandra jensen'], genre: 'horror', lang: 'english',
         syn: 'a group of teenagers find an embalmed hand that lets you talk to the dead. ninety seconds, never more. one night somebody holds on too long.',
         q: [['i shook the hand in row a. i’m not saying what happened.', 'seat a7'], ['thursday is the only night nobody walks to the tram alone.', 'the usher']] },
    5: { slug: 'la-la-land', title: 'la la land', year: 2016, dir: 'damien chazelle', min: 128, ar: 2.55, tone: 'blue',
         cast: ['emma stone', 'ryan gosling'], genre: 'musical, romance', lang: 'english',
         syn: 'an actress and a jazz pianist fall in love in los angeles while chasing the thing they came for. by the end, only one of them gets to keep both.',
         q: [['we danced down rua da rosa. we still made the 28.', 'seats f5 & f6'], ['the epilogue gets me every friday. every single friday.', 'seat k1']] },
    6: { slug: 'arrival', title: 'arrival', year: 2016, dir: 'denis villeneuve', min: 116, ar: 2.39, tone: 'tejo',
         cast: ['amy adams', 'jeremy renner'], genre: 'science fiction', lang: 'english',
         syn: 'twelve ships land on earth and wait. a linguist is asked to talk to whatever is inside. learning their language changes how she remembers her own life.',
         q: [['i knew how it ended. i came back anyway.', 'row c'], ['there was fog on the river when we came out.', 'seat g12']] },
    0: { slug: 'aftersun', title: 'aftersun', year: 2022, dir: 'charlotte wells', min: 101, ar: 1.85, tone: 'ember',
         cast: ['paul mescal', 'frankie corio'], genre: 'drama', lang: 'english',
         syn: 'a cheap holiday in turkey, a young father, his eleven-year-old daughter and a camcorder. twenty years later she watches the tapes and tries to see him.',
         q: [['i called my dad from the tram.', 'seat c3'], ['the projector was crying too.', 'the projectionist']] }
  };
  LS.DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  LS.ORDER = [2, 3, 4, 5, 6, 0, 1]; // our week starts on tuesday

  /* ═══════════════ lisbon time ═══════════════ */
  const fmtParts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  /* lisbon wall-clock as a fake-utc timestamp: all show maths happen in this space */
  LS.now = () => {
    const p = Object.fromEntries(fmtParts.formatToParts(new Date()).map(x => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  };
  LS.pad = (n, l = 2) => String(n).padStart(l, '0');
  LS.hm = (min) => { min = ((Math.round(min) % 1440) + 1440) % 1440; return LS.pad(Math.floor(min / 60)) + ':' + LS.pad(min % 60); };
  LS.hms = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return LS.pad(Math.floor(s / 3600)) + ':' + LS.pad(Math.floor(s / 60) % 60) + ':' + LS.pad(s % 60); };
  LS.ends = (f) => LS.START + f.min;
  LS.date = (t) => { const d = new Date(t); return LS.pad(d.getUTCDate()) + '.' + LS.pad(d.getUTCMonth() + 1) + '.' + d.getUTCFullYear(); };

  /* the show that is running now, or the next one */
  LS.show = (skip = 0) => {
    const now = LS.now();
    const day0 = Math.floor(now / 864e5) * 864e5;
    let found = -1;
    for (let k = -1; k < 9; k++) {
      const day = day0 + k * 864e5, dow = new Date(day).getUTCDay(), f = LS.WEEK[dow];
      if (!f) continue;
      const start = day + LS.START * 6e4, end = start + f.min * 6e4, tram = day + LS.TRAM * 6e4;
      if (Math.max(end, tram) <= now) continue;
      found++;
      if (found < skip) continue;
      let state = 'next';
      if (now >= start && now < end) state = 'live';
      else if (now >= end) state = 'run';
      else if (now >= day + LS.DOORS * 6e4) state = 'doors';
      return { f, dow, day, start, end, tram, now, state };
    }
  };

  /* ═══════════════ image slots ═══════════════ */
  LS.fillSlot = (el) => {
    const path = el.dataset.img;
    el.classList.remove('has-img');
    $$(':scope > img', el).forEach(i => i.remove());
    el.dataset.label = path ? 'img/' + path + (el.dataset.note ? ' — ' + el.dataset.note : '') : (el.dataset.note || '');
    if (!path) return;
    const base = path.replace(/\.(jpe?g|png|webp)$/i, '');
    const tries = [path, base + '.png'].filter((v, i, a) => a.indexOf(v) === i);
    const go = (i) => {
      if (i >= tries.length || el.dataset.img !== path) return;
      const im = new Image();
      im.alt = '';
      im.decoding = 'async';
      im.onload = () => { if (el.dataset.img !== path) return; el.prepend(im); el.classList.add('has-img'); el.dispatchEvent(new CustomEvent('slot:ready', { detail: im })); };
      im.onerror = () => go(i + 1);
      im.src = 'img/' + tries[i];
    };
    go(0);
  };
  LS.setSlot = (el, path, note, tone) => {
    if (!el) return;
    if (tone) el.dataset.tone = tone;
    if (note != null) el.dataset.note = note;
    el.dataset.img = path;
    LS.fillSlot(el);
  };
  $$('.slot[data-img]').forEach(LS.fillSlot);

  /* ═══════════════ scramble ═══════════════ */
  const GLYPH = '0123456789:·/—ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  LS.scramble = (el, text = el.dataset.text || el.textContent, dur = 700) => {
    el.dataset.text = text;
    if (RM) { el.textContent = text; return; }
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), n = Math.floor(p * text.length);
      el.textContent = text.slice(0, n) + [...text.slice(n)].map(c => c === ' ' ? ' ' : GLYPH[(Math.random() * GLYPH.length) | 0]).join('');
      if (p < 1) requestAnimationFrame(tick); else el.textContent = text;
    };
    requestAnimationFrame(tick);
  };

  /* ═══════════════ toast-free tab title ═══════════════ */
  const TITLE = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'the lights are going down…' : TITLE;
  });

  /* ═══════════════ bar clock ═══════════════ */
  const clockEl = $('[data-clock]'), nextEl = $('[data-next]');
  const tickClock = () => {
    const n = new Date(LS.now());
    if (clockEl) clockEl.textContent = LS.pad(n.getUTCHours()) + ':' + LS.pad(n.getUTCMinutes()) + ':' + LS.pad(n.getUTCSeconds());
    if (nextEl) {
      const s = LS.show();
      nextEl.textContent = s ? (s.state === 'live' ? '· now: ' : s.state === 'run' ? '· run for the 28' : '· next: ') + (s.state === 'run' ? '' : s.f.title) : '';
    }
  };
  tickClock(); setInterval(tickClock, 1000);

  /* ═══════════════ lenis + scrolltrigger ═══════════════ */
  if (G() && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!RM && window.Lenis) {
    const lenis = (LS.lenis = new Lenis({ lerp: 0.09, smoothWheel: true }));
    if (G()) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    lenis.stop();
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const t = $(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    LS.lenis ? LS.lenis.scrollTo(t, { duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
  });

  /* ═══════════════ loader: every second a different night, until 23:40:00.
     the last frame is tonight's still: it opens to fill the screen and becomes the hero ═══════════════ */
  LS.LOADER = ['film-la-la-land-5', 'last-chungking-express', 'film-arrival-6', 'last-the-substance',
    'film-in-the-mood-for-love-7', 'last-bones-and-all', 'film-aftersun-6', 'film-talk-to-me-5'];
  LS.ready = new Promise((res) => {
    const ld = $('.ld');
    const done = () => {
      document.body.classList.remove('is-loading');
      LS.lenis && LS.lenis.start();
      res();
      document.dispatchEvent(new CustomEvent('ls:ready'));
    };
    if (!ld) return done();
    const seen = sessionStorage.getItem('ls-seen');
    sessionStorage.setItem('ls-seen', '1');
    if (RM || !G()) { ld.remove(); return done(); }
    const frame = $('.ld__frame', ld), t = $('.ld__t', ld);
    const d = $('.ld__d', ld);
    if (d) d.textContent = LS.date(LS.now());
    const pics = LS.LOADER.map(n => 'img/HOME/thumbs/' + n + '.jpg').concat('img/HOME/hero.jpg');
    frame.innerHTML = pics.map(src => `<img src="${src}" alt="" decoding="async">`).join('');
    const imgs = $$('img', frame);
    const ready = Promise.all(imgs.map(i => (i.decode ? i.decode().catch(() => {}) : null)));
    const wait = new Promise(r => setTimeout(r, seen ? 400 : 1600));
    Promise.race([ready, wait]).then(() => {
      const step = seen ? .07 : .19;
      const tl = gsap.timeline({ onComplete: () => ld.remove() });
      tl.from(['.ld__top', '.ld__bot'], { opacity: 0, y: 8, duration: .5, ease: 'power2.out' }, 0)
        .from(frame, { scale: .9, opacity: 0, duration: .6, ease: 'expo.out' }, 0)
        .from('.ld__cap', { opacity: 0, x: -10, duration: .5, ease: 'expo.out' }, .15);
      imgs.forEach((im, i) => {
        tl.call(() => {
          imgs.forEach((o, k) => o.classList.toggle('is-on', k === i));
          const last = i === imgs.length - 1;
          t.textContent = last ? '23:40:00' : '23:39:' + (52 + i);
          t.classList.toggle('is-zero', last);
        }, null, .25 + i * step);
      });
      const end = .25 + (imgs.length - 1) * step + (seen ? .2 : .55);
      const cover = () => {
        const r = frame.getBoundingClientRect();
        return Math.max(innerWidth / r.width, innerHeight / r.height) * 1.04;
      };
      tl.to(['.ld__top', '.ld__bot', '.ld__cap'], { opacity: 0, duration: .35, ease: 'power1.in' }, end)
        .to(frame, { scale: cover, y: () => innerHeight * .04, duration: 1.15, ease: 'expo.inOut' }, end)
        .add(done, end + .8)
        .to(ld, { opacity: 0, duration: .5, ease: 'power1.out' }, end + .85);
    });
  });

  /* ═══════════════ cursor ═══════════════ */
  if (FINE) {
    document.documentElement.classList.add('has-cur');
    const cur = $('.cur'), lbl = $('.cur__lbl');
    let x = innerWidth / 2, y = innerHeight / 2;
    const mx = G() ? gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' }) : (v) => (cur.style.left = v + 'px');
    const my = G() ? gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' }) : (v) => (cur.style.top = v + 'px');
    addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY; mx(x); my(y);
      document.documentElement.style.setProperty('--lx', x + 'px');
      document.documentElement.style.setProperty('--ly', y + 'px');
    }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cur], a, button, input');
      if (t) { lbl.textContent = t.dataset.cur || ''; cur.classList.toggle('is-on', true); lbl.style.display = t.dataset.cur ? '' : 'none'; }
      else cur.classList.remove('is-on');
    });
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('mouseleave', () => G() && gsap.to(cur, { opacity: 0, duration: .2 }));
    document.addEventListener('mouseenter', () => G() && gsap.to(cur, { opacity: 1, duration: .2 }));
  }

  /* ═══════════════ magnetic ═══════════════ */
  if (FINE && G() && !RM) {
    $$('.mag').forEach(el => {
      const qx = gsap.quickTo(el, 'x', { duration: .5, ease: 'elastic.out(1,.4)' });
      const qy = gsap.quickTo(el, 'y', { duration: .5, ease: 'elastic.out(1,.4)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * .3); qy((e.clientY - r.top - r.height / 2) * .4);
      });
      el.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
  }

  /* ═══════════════ bar: appears when the hero (or the page title) is gone ═══════════════ */
  const bar = $('.bar');
  if (bar) {
    const first = $('[data-bar="hide"]');
    if (first && G() && window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: first, start: 'bottom 80px', onEnter: () => bar.classList.add('is-in'), onLeaveBack: () => bar.classList.remove('is-in') });
    } else bar.classList.add('is-in');
  }

  /* ═══════════════ kickers scramble when they enter ═══════════════ */
  LS.ready.then(() => {
    $$('.kick').forEach(el => {
      if (!window.ScrollTrigger) return;
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => LS.scramble(el) });
    });
  });

  /* ═══════════════ house lights: press L (or ↑↑↓↓←→←→ b a) ═══════════════ */
  LS.lights = (on = !document.documentElement.classList.contains('is-dark')) => {
    document.documentElement.classList.toggle('is-dark', on);
    document.title = on ? '● now showing — LAST SHOW' : TITLE;
    return on ? 'house lights down. phones off.' : 'house lights up.';
  };
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kq = [];
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    kq = [...kq, e.key].slice(-10);
    if (kq.join() === KONAMI.join()) { LS.lights(true); kq = []; return; }
    if (e.key === 'l' || e.key === 'L') LS.lights();
    if (e.key === 'Escape') LS.lights(false);
  });

  /* ═══════════════ console ═══════════════ */
  console.log('%c\n   ___________________\n  |  _______________  |       /\\_/\\\n  | |               | |      ( o.o )  <3\n  | |  LAST  SHOW   | |       > ^ <\n  | |_______________| |      (")_(")\n  |___________________|      row f, seat 7\n\n   ┌─┐┬ ┬┌─┐┌─┐┌┬┐┬ ┬ ┬  ┌─┐┬─┐┬\n   │ ┬├─┤│ │└─┐ │ │ └┬┘  │ ┬├┬┘│\n   └─┘┴ ┴└─┘└─┘ ┴ ┴─┘┴ o └─┘┴└─┴─┘ ♥\n\n   concept, design & code by ghostly.grl ♥\n   try LS.help()\n', 'color:#e3261c;font-family:monospace;font-size:12px');
  LS.help = () => console.log('LS.show()     → tonight’s film, start, end, the tram\nLS.WEEK       → the week (monday the screen rests)\nLS.lights()   → house lights down / up (or press L)\nLS.hm(LS.TRAM) → the last 28, sharp');
})();
