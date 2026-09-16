---
version: 1
slug: "src-app-frontend-page-tsx"
primary_target: "src/app/(frontend)/page.tsx"
related_targets:
  - "src/app/(frontend)/events/page.tsx"
  - "src/app/(frontend)/projects-grants/page.tsx"
  - "src/app/(frontend)/board-members/page.tsx"
---

# Friends of Recreation site — Home, Events, Projects & Grants, Board

Mode: Persuade.

Audience: Saratoga Springs families on phones from Facebook, local donors deciding if this group is
real, partners and grant seekers. Job: understand the mission, see proof, find the next event,
donate, ask.

## Direction contract

THESIS: This organization's whole meaning is that neighbors bought the things kids play on — floor
hockey goals for $500, a playground bucket seat for $515, dugouts for $15,430. So the site is a
**community ledger**: warm editorial type set against the organization's own photographs, and a deep
green field where years, objects, and dollar amounts are set as display type loud enough to be the
proof. It refuses the flat municipal color bands and undersized type of the incumbent build, refuses a
50/50 split hero, refuses three matching impact cards, and refuses metric tiles standing in for
evidence.

OWN-WORLD: Warm paper `#FBF8F2` and a warm tint `#F1EBDF`; warm ink `#17140E`; deep grass `#0E4A2C`
for proof and closing fields; tomato `#C6371C` for Donate and emphasis, sampled from the coral
Friends of Recreation event shirts; gold `#F0B429` only as a marker stroke and index numeral.
Bricolage Grotesque set large, mixed case, tight tracking, with the `wdth` axis narrowed on display
sizes; Atkinson Hyperlegible for text because families and older board members read this. Photographs
are always rounded (18–28px) — wide panels and a horizontal rail. Amounts are tabular display figures.

Inline photo chips inside headlines are **withdrawn**; the headline is unbroken type. The hero instead
carries one cinematic photographic layer *behind* part of the headline, borrowed from the Gymnasium
Wall proposal's mural-behind-inscription device and translated into this palette: the type sits above
the image and stays fully legible, and the layer reads as the same photographic surface as the wide
panel below it rather than as a separate decorative block.

STORY: mission with a photograph woven through it → what the money is for, as three unequal
typographic pillars → where the money went, as the green ledger → the real places it landed → what is
next → donate → ask a question. Launch-dependent content (board roster, donation URL, events) shows an
intentional pre-launch state instead of invented filler.

FIRST VIEWPORT: Slim sticky header with the black seal, typeset wordmark, four links, tomato Donate.
Then an oversized left-aligned mission headline set as unbroken type over one cinematic photographic
layer, one lead sentence, tomato Donate plus a quiet "See your support in action", and a wide rounded
photograph settling in below with a tilted next-event chip on its lower edge and a derived proof line
(first year, project count) beside it. Mobile: headline over a reduced image layer, actions,
photograph, next event.

FORM: Community Ledger. Signature interaction: the hero's headline and its photographic layer unmask
together on first paint under one coordinated reveal, and the type scrolls at a very slightly
different rate than the image beneath it; ledger rows lift and brighten their amount on hover and
focus. No perpetual motion, and no generic fade-up. Everything else is reveal-on-enter with a short
stagger, once, and every animation is wrapped in `prefers-reduced-motion: no-preference` with a
`<noscript>` guarantee that content is visible. The reduced-motion state is a composed static
alternative, not a disabled animation.

MICRO-TYPE: Uppercase eyebrows above section headings are **withdrawn** — the heading carries the
hierarchy. A small label survives only where it carries information the heading does not (a cancelled
flag, a footer column heading, a field label).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance.
