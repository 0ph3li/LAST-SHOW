# LAST SHOW

> one screen. one film a night. 23:40.
> every film ends before the last tram.

**LAST SHOW** is a concept website for a one-screen cinema in bairro alto, lisbon: rua da rosa 113, behind a red door, 94 seats, open since 1931 and again since 2019. There is one film a night at 23:40, with no trailers, no ads and no second screening. The programme follows one rule: every film has to end in time for you to walk three minutes downhill and catch the last 28 tram, which leaves largo de camões at 01:52.

The whole site runs on lisbon time. It knows what's on tonight, whether the doors are open, how long is left of the film, how many seats are taken, what the weather will be at 23:00 and when the sun comes up if you miss the tram.

concept, design & code by **ghostly.grl ♥**

---

## contents

- [the idea](#the-idea)
- [the clock](#the-clock)
- [the week](#the-week)
- [the look](#the-look)
- [the pages](#the-pages): [home](#home) · [tonight](#tonight) · [week](#week) · [room](#room) · [tram](#tram) · [visit](#visit)
- [always on](#always-on)
- [photos](#photos)
- [privacy](#privacy)
- [run it](#run-it)
- [structure](#structure)
- [stack](#stack)

---

## the idea

*saudade* is the portuguese word for missing something that may never come back. LAST SHOW is built around one small version of it: the end of a film, the lights coming up, and the run for the last tram.

The rules of the world:

- **one film a night.** tuesday to sunday at 23:40. on monday the screen rests.
- **the film ends before the tram.** the last 28 leaves camões at 01:52 and the walk takes 3 minutes, so a film can run until 01:49 at the latest. la la land (128′) makes it with one minute to spare, only if you leave on the last frame.
- **seat f7 is never sold.** nobody remembers why.
- **if you miss the tram, stay for the sunrise.** the tram page tells you when it is.

---

## the clock

Everything time-related is computed in `Europe/Lisbon`, wherever you open the site. `LS.now()` turns lisbon's wall-clock time into a timestamp and all the show maths happens on that.

`LS.show()` returns the show that's running, or the next one, with a state:

| state | when | what the site says |
|---|---|---|
| `next` | before 23:00 | the countdown to 23:40 and the doors |
| `doors` | 23:00 – 23:40 | *doors are open*, minutes until the film |
| `live` | during the film | *now showing · ends in* |
| `run` | the film is over, the 28 hasn't left yet | *the film ended · last 28 in*, counting down to 01:52 |

`LS.show(1)`, `LS.show(2)`… give the shows after that, skipping mondays. The seats taken each night come from a seed made from the date, so home, tonight, week and room always agree on the same number.

---

## the week

| day | film | runtime | ends | spare for the 28 |
|---|---|---|---|---|
| tuesday | perfect days (wim wenders, 2023) | 124′ | 01:44 | 5 min |
| wednesday | in the mood for love (wong kar-wai, 2000) | 98′ | 01:18 | 31 min |
| thursday | talk to me (danny & michael philippou, 2023) | 95′ | 01:15 | 34 min |
| friday | la la land (damien chazelle, 2016) | 128′ | 01:48 | 1 min |
| saturday | arrival (denis villeneuve, 2016) | 116′ | 01:36 | 13 min |
| sunday | aftersun (charlotte wells, 2022) | 101′ | 01:21 | 28 min |
| monday | — | | | the screen rests |

The programme lives in `LS.WEEK` in `js/main.js` (title, year, director, runtime, aspect ratio, colour tone, cast, genre, language, story, two audience quotes). Change a film there and every page follows. The *last shows* archive on the home lists sixteen past nights, from tabu to the substance.

---

## the look

The whole site was built screen by screen on the moodboard in `VIBES/`: twenty references, each one copied as closely as possible and then turned into this cinema. The tables under [the pages](#the-pages) say which reference each screen comes from.

| colour | |
|---|---|
| ink | `#0d0c0b` |
| cream | `#f4edd8` |
| cinema red | `#e3261c` |
| azulejo blue | `#2d4fd6` |
| tram yellow | `#f5c01b` |
| gold | `#c9a227` |

Each page also has its own palette, taken from its references: aqua and red for the sunrise poster, peach and orange for the bar, red monochrome for the room, green and orange for the tram, greys for visit.

| type | used for |
|---|---|
| **Big Shoulders Display** | the big condensed titles, the bar, the footer |
| **Instrument Serif** | the quiet headings, the titles on visit |
| **Inter Tight** | body text |
| **IBM Plex Mono** | labels, times, the clock |
| **Monsieur La Doulaise** | the signature |
| Italiana · Bricolage Grotesque · Playfair Display · Archivo · Lexend | one or two references each: the whisper, the sunrise posters, the drama poster, the joker panel and blade runner, the tram poster |

Motion uses only `transform` and `opacity`, so scrolling stays smooth: scrubbed parallax, sticky stacks, crossfades, words that rise letter by letter. There are no pinned 3D scenes and no live blur.

---

## the pages

### home

`index.html` · *what's on tonight, and why it ends when it does.*

| section | ref | what happens |
|---|---|---|
| loader | EVERY : SECOND | a different night every second, from 23:39:52 to 23:40:00, then tonight's still opens to full screen and becomes the hero |
| hero | FIGUREFILM | a giant broken title over the still, which follows your mouse like a dolly. a pill with the live countdown |
| whisper | WHISPER FROM THE OCEAN | black and yellow serif. a stone arch opens onto the tejo as you scroll |
| tonight | FRAMEHAUS | an echo word and rounded cards for tonight and tomorrow, with reviews. they stack |
| saudade | INNERSTATE | a giant red word over a bairro alto street. a person stands still in front of it while the word smears into the crowd, letter by letter |
| manifesto | THE LOVERS | gold serif. the letters fill as you read |
| this week | FIGUREFILM featured work | a blue grid of the six nights. the frame changes shape to each film's aspect ratio |
| the room | INTRO + BLADE RUNNER | red, scanlines, a rounded window, a side tab, a big **1** and an outlined 1931 |
| last tram | SUNRISE | an aqua one-sheet with laurels and a heavy red LAST TRAM |
| the walk | SKĄD DOKĄD | *rua da rosa ——— camões* on a green band between two duotone photos. **will you make the tram?** pick a night, say how long you stay for the credits, and it tells you if you make the 01:52 |
| last shows | CHERNOBYL | an episode guide of sixteen past nights: one big still and the list on the right with thumbnails. click one, or let it move on every 6 seconds |
| the end | DREAM BEATS · THANK YOU | a blurred still pulls into focus: OBRIGADO |
| footer | FIGUREFILM | black and mono. SEE YOU AT 23:40 |

### tonight

`tonight.html` · *one film, the whole night, minute by minute.*

| section | ref | what happens |
|---|---|---|
| tonight | EPI.02 MY DOGS | the film still full screen, a giant yellow title, the story in caps, *pick a seat* underlined, a live countdown |
| the poster | THE DRAMA | a framed one-sheet: the two leads on top, the still in red duotone, the title with a script word through it, three more stills |
| the film | JOKER | a teal duotone panel: the story, then year, director, runtime and genre in a column. a rolling fact (cast, format, language, rating). a trailer box that answers *we don't do trailers* |
| the night | NORVALE | a cream card on black. LIGHTS DOWN with the usher's photo inside the O, and the night in five steps: doors, the bar closes, lights down, lights up, the last 28. floating cards show the seats taken and the rating + aspect ratio |
| the weather | THE.WEATHER | a wet window and the real lisbon forecast for 23:00 that night (open-meteo), the other nights of the week, and a tip for the walk |
| the bar | MUSIC AND SOUND DESIGN | peach, a big outlined 23:00, a heavy orange title, the menu, and a cup seen from above that turns as you scroll |

`tonight.html` shows the next show. `tonight.html?d=5` shows a given weekday (0 sunday … 6 saturday). The weather panel, week and visit link to other nights this way, and *pick a seat* opens the seat map on the same night.

### week

`week.html` · *the next six shows, with real dates.*

| section | ref | what happens |
|---|---|---|
| the week | CYBER ALIEN 2077 | a pale sage panel in a black frame. WEEK as a giant vertical word, the ISO week number big (n°47), an index 01–06 that swaps the film in the arch (click, or it moves by itself), a door code drawn like a qr, a thumbnail that opens that night |
| six nights | DREAM BEATS | a treatment deck on tan. the cover (*pick your night: six films*), then one slide per film in the deck's layouts: CONCEPT (giant title, story, genre), #reaction (the story, `#saturday`, a quote from the audience), MOOD & TONE, and a grid of stills |
| monday | THANK YOU | MONDAY, WE REST over a blurred room |

Each night shows its real date, when the film ends, the minutes to spare for the last 28 and the seats left.

### room

`room.html` · *94 seats, one screen, a booth.*

| section | ref | what happens |
|---|---|---|
| the room | BLADE RUNNER 2049 | a red monochrome screen in a black frame with scanlines. THE ROOM / 1931 (outlined), a side rail, *pick a seat €6*. four views of the room slide by (01 / 04) with a progress line and arrows. the white dot turns off the house lights |
| hall, screen, booth, seats | INTRO | red, a rounded window, a giant word, a navy side tab, a big number 1–4. the four slides stack as you scroll |
| pick a seat | — | the real map: ten rows (a–j), an aisle, 94 seats. pick a night and see what's taken (the same numbers as on tonight and week). choose a seat and it prints on the ticket stub. **hold this seat** keeps it in your browser for that night. f7 is never sold |

`room.html?d=<weekday>#seats` opens the map on a given night.

### tram

`tram.html` · *the last 28 leaves camões at 01:52.*

| section | ref | what happens |
|---|---|---|
| the ride | SKĄD DOKĄD | the whole poster, top to bottom. the wooden seats of an old tram in green and orange duotone, with the live countdown to 01:52. then the green band *camões ——— prazeres*: a little yellow 28 runs the route as you scroll, and each stop lights up with its time and a line about it (*01:56 · são bento · past the parliament, lights still on*). then the driver's cab, with the tram's credits written like a film's: driver senhor abílio, 31 years on the line, heating none, windows open, mostly |
| if you miss it | SUNRISE | the aqua one-sheet with a red night photo. laurels show the real sunrise time in lisbon the morning after (open-meteo), the first 28 at 06:30 and the first bica at 06:00. *starring you and the river, film by the night*. SUNRISE in huge red |

### visit

`visit.html` · *a red door halfway up rua da rosa.*

| section | ref | what happens |
|---|---|---|
| find us | BASECAMP | lisbon in black and white outside, a grey glass panel inside. a blurred figure at a window comes into focus as you scroll and drifts with your mouse. pills (*find us, the way, before*), a **where are you?** search that tells you how far you are and how to come (*from alfama: 25′ on foot, or the 28 to camões*), and a seat pill that counts the seat you held. three columns of facts in the ref's format: **N:** and **W:** are the cinema's coordinates, **↑:** its height on the hill, then the address, the hours (with a live line about the next show) and the tickets. three small photos get their colour back on hover |
| the way up | BASECAMP | the same panel with a map of the bairro alto drawn in lines (not to scale). four ways in: the 28, the metro, the glória, the river. pick one and the route draws itself in red, with the minutes and three steps |
| before you come | BASECAMP | the fact columns again, over a dark room: six things the usher would tell you anyway (late, language, the step, the bar, phones, private screenings) |
| your night | BASECAMP | the film you're seeing (the night of the seat you held, or the next show), the end time, the minutes to spare for the 28, your seat. **add to calendar** downloads an `.ics` made in your browser |

---

## always on

- **the bar** shows lisbon time and what's next on every page. on a phone it shows the nav
- **custom cursor** with labels (*94 seats*, *the 28*, *find us*), magnetic buttons, scrambled kickers, lenis smooth scroll
- **house lights**: press **L** (or ↑ ↑ ↓ ↓ ← → ← → b a). the room goes dark and your cursor becomes the usher's torch. **esc** brings the lights back
- when you leave the tab, it says *the lights are going down…*
- in the console: an ascii screen with a cat in row f, seat 7, and `LS.help()`
- respects `prefers-reduced-motion`

---

## photos

Every image is a slot: drop a file with the right name into `img/` and it appears (`.jpg` or `.png`). Until then, each slot shows its filename and what should go there. **Every name and description is in [`img/README.md`](img/README.md).**

- **film images are real stills of the films** (tmdb backdrops). every film has eight, so the same picture never shows up twice on a page. the films and their images belong to their studios and distributors. that's fine for a concept site, but for anything public use the distributors' press stills. sources are in `img/HOME/CREDITS.txt`
- **every other photo** (the room, the street, the tram, the people) is a free unsplash photo standing in. sources are in each folder's `CREDITS.txt`

---

## privacy

There's no backend, no analytics and no cookies.

- the only requests outside the site are Google Fonts, GSAP, Lenis and **open-meteo** (the weather on tonight, the sunrise on tram). open-meteo needs no key and only receives lisbon's coordinates
- the seat you hold is kept in your browser's `localStorage`, under keys starting with `ls-`
- the calendar file is made in the browser and downloaded straight to you

---

## run it

Any static server works:

```bash
python3 -m http.server 5830
```

→ http://localhost:5830

It also works as it is on GitHub Pages or any static host. There's no build step and nothing to install. Best on desktop Chrome, Safari or Firefox; it works on phones too.

---

## structure

```
index.html          home
tonight.html        tonight's film, the night minute by minute, the weather, the bar
week.html           the next six shows: the 2077 index, the dream beats deck, monday
room.html           the room: blade runner slider, the four rooms, the seat map
tram.html           the last 28: the ride to prazeres, the sunrise if you miss it
visit.html          find us: the basecamp panel, the map, before you come, your night

css/style.css       shared: palette, type, slots, cursor, bar, loader, house lights, footer
css/home.css        · tonight.css · week.css · room.css · tram.css · visit.css   one per page

js/main.js          window.LS: lisbon clock, the week, LS.show(), slots, cursor, lenis,
                    scramble, magnetic, house lights, loader
js/home.js          hero, countdown, cards, this week, will-you-make-the-tram, last shows
js/tonight.js       which night, the fact roll, the five steps, the weather, the bar
js/week.js          the next six shows, the index, the deck
js/room.js          the slider, the stacking rooms, the seat map + ticket
js/tram.js          the countdown, the moving 28, the sunrise
js/visit.js         the facts, where are you, the routes, the six notes, your night + .ics

img/                photos, one folder per page (see img/README.md)
favicon.svg
VIBES/              the moodboard
```

---

## stack

HTML, CSS and vanilla JavaScript · [GSAP 3.12.5](https://gsap.com) + ScrollTrigger · [Lenis 1.1.13](https://lenis.darkroom.engineering) · SVG (the map) · [open-meteo](https://open-meteo.com) (weather + sunrise) · Google Fonts: Big Shoulders Display, Instrument Serif, Inter Tight, IBM Plex Mono, Monsieur La Doulaise, Italiana, Bricolage Grotesque, Playfair Display, Archivo, Lexend

---

```
   ___________________
  |  _______________  |       /\_/\
  | |               | |      ( o.o )  <3
  | |  LAST  SHOW   | |       > ^ <
  | |_______________| |      (")_(")
  |___________________|      row f, seat 7
```

a concept cinema. the films are real, the cinema isn't (yet).

concept, design & code by **ghostly.grl ♥**
