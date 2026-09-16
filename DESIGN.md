---
name: Friends of Recreation
description: A community ledger — warm editorial type carrying a town's own photographs, with years, objects, and dollar amounts set loud enough to be the proof.
colors:
  paper: "#fbf8f2"
  paper-tint: "#f1ebdf"
  paper-deep: "#e7dfd0"
  ink: "#17140e"
  ink-soft: "#6a6252"
  field: "#0e4a2c"
  field-ink: "#f4f7ee"
  field-ink-soft: "#bfd8c4"
  flare: "#c6371c"
  flare-deep: "#a72c14"
  flare-ink: "#fff8f2"
  gold: "#f0b429"
  navy: "#17324d"
  teal: "#2a6f6b"
  teal-ink: "#f6f9fa"
  grass: "#3e7d4e"
  snow: "#f6f9fa"
  brass: "#d8a73c"
  alert: "#9c2a10"
  rule: "color-mix(in srgb, #17140e 14%, transparent)"
  rule-strong: "color-mix(in srgb, #17140e 28%, transparent)"
  rule-field: "color-mix(in srgb, #f4f7ee 22%, transparent)"
typography:
  hero:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 9vw, 7.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.045em"
    fontVariation: "'wdth' 88"
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 92"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 92"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 92"
  statement:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3.1vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 94"
  amount:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3.6vw, 2.9rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "tabular-nums"
    fontVariation: "'wdth' 90"
  numeral:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.05em"
    fontFeature: "tabular-nums"
    fontVariation: "'wdth' 88"
  lead:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.7vw, 1.45rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  small:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 100"
rounded:
  r1: "4px"
  r2: "10px"
  r3: "18px"
  r4: "28px"
  pill: "999px"
spacing:
  s2: "0.5rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.5rem"
  s6: "2rem"
  s7: "3rem"
  s8: "clamp(3.5rem, 7vw, 6rem)"
  s9: "clamp(5rem, 11vw, 9.5rem)"
  section-y: "clamp(4rem, 9vw, 8rem)"
  inset: "clamp(1.25rem, 5vw, 4rem)"
components:
  button-primary:
    backgroundColor: "{colors.flare}"
    textColor: "{colors.flare-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.flare-deep}"
    textColor: "{colors.flare-ink}"
  button-primary-on-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-primary-on-field-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  button-primary-disabled:
    backgroundColor: "color-mix(in srgb, #c6371c 34%, #e7dfd0)"
    textColor: "color-mix(in srgb, #17140e 72%, transparent)"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.5rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "color-mix(in srgb, #17140e 5%, transparent)"
    textColor: "{colors.ink}"
  button-nav:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.05rem"
    height: "2.75rem"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.r2}"
    padding: "0.75rem 0.9rem"
    height: "3rem"
    width: "100%"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    size: "0.98rem"
    padding: "0.35rem 0"
  photo-frame:
    backgroundColor: "{colors.paper-deep}"
    rounded: "{rounded.r3}"
  photo-panel:
    backgroundColor: "{colors.paper-deep}"
    rounded: "{rounded.r4}"
  photo-chip:
    backgroundColor: "{colors.paper-deep}"
    rounded: "clamp(10px, 1.6vw, 18px)"
    width: "clamp(3.6rem, 9.5vw, 8.5rem)"
  ledger-amount:
    textColor: "{colors.gold}"
    typography: "{typography.amount}"
  ledger-amount-on-paper:
    textColor: "{colors.flare}"
    typography: "{typography.amount}"
  ledger-amount-quiet:
    textColor: "{colors.field-ink-soft}"
    typography: "{typography.small}"
    width: "18ch"
  event-datebox:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.r2}"
    padding: "0.5rem 0.7rem"
    width: "3.4rem"
  event-datebox-hover:
    backgroundColor: "{colors.flare}"
    textColor: "{colors.flare-ink}"
  event-flag:
    backgroundColor: "color-mix(in srgb, #9c2a10 12%, #fbf8f2)"
    textColor: "{colors.alert}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.6rem"
  next-event-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r3}"
    padding: "0.75rem 1.5rem 0.75rem 1rem"
  next-event-datechip:
    backgroundColor: "{colors.flare}"
    textColor: "{colors.flare-ink}"
    rounded: "{rounded.r2}"
    padding: "0.4rem 0.65rem"
  pending-panel:
    backgroundColor: "{colors.paper-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r4}"
    padding: "3rem 2rem"
  footer-column-heading:
    textColor: "color-mix(in srgb, #fbf8f2 60%, transparent)"
    typography: "{typography.label}"
  band-tint:
    backgroundColor: "{colors.paper-tint}"
    textColor: "{colors.ink}"
    padding: "{spacing.section-y} 0"
  band-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.field-ink}"
    padding: "{spacing.section-y} 0"
  band-teal:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.teal-ink}"
    padding: "{spacing.section-y} 0"
  band-flare:
    backgroundColor: "{colors.flare}"
    textColor: "{colors.flare-ink}"
    padding: "{spacing.s9} 0"
  site-footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "{spacing.s8} 0 {spacing.s6}"
---

# Design System: Friends of Recreation

## Overview

**Creative North Star: "The Community Ledger"**

The organization's whole meaning is that neighbours bought the things kids play on — floor hockey goals for $500, a playground bucket seat for $515, dugouts for $15,430. The site is therefore a ledger: warm editorial type carrying the organization's own photographs, and a deep green field where years, objects, and dollar amounts are set as display type loud enough to be the proof.

The register is warm, bold, and civic rather than institutional. Everything sits on one of five grounds — warm paper, a warm tint, the deep green field, the tomato field, or the ink footer — and a section's identity comes from which ground it stands on, not from a container drawn around it. Type does the structural work: headings run oversized, mixed case, with the `wdth` axis narrowed as the size grows, while reading copy stays in Atkinson Hyperlegible at a generous 1.62 line height because families and older board members read this. Lists are separated by hairline rules rather than boxed into cards, and photographs are the only elements permitted to look lifted.

Density is low and deliberate: long vertical bands, wide measures capped in characters rather than pixels, and single-column reading at every width. The layout never fakes evidence — where content is a launch dependency (the board roster, the donation URL, the event calendar) a composed pending panel states the truth instead of filling the space with plausible fiction.

**Key Characteristics:**

- A ledger, not a brochure: years, objects, and dollar amounts carry the argument.
- Five tonal grounds (paper, tint, green field, tomato field, ink footer) instead of decorative containers.
- Oversized Bricolage Grotesque headings, narrowed and tightly tracked; Atkinson Hyperlegible for everything read.
- Amounts are always tabular display figures.
- Every photograph is generously rounded (18–28px) and slightly tilted where it is small.
- Near-flat: depth comes from ground changes, hairline rules, and photographic shadow only.
- Pill controls, hairline fields, no card borders.
- Motion is enhancement only; content is visible without JavaScript and without motion.

## Colors

A warm, sun-bleached palette derived from a monochrome black seal plus the organization's own photography: paper and ink for reading, deep grass for proof, and the tomato of the event shirts for action.

### Primary

- **Tomato** (`#c6371c`): The action and emphasis colour. It carries Donate on paper, the named-place proof lines on the pillars, the ledger amount when a row sits on paper or tint, the nav underline, the board role line, the label tick, the hovered event date box, and the closing call-to-action field. Its deep variant (`#a72c14`) exists only as the hover state of a tomato button.

### Secondary

- **Deep Grass Green** (`#0e4a2c`): The proof ground. The ledger band stands on it, and it is the only large field where amounts turn gold. Text on it is a warm off-white (`#f4f7ee`) with a muted sage (`#bfd8c4`) for meta lines and notes.

### Tertiary

- **Gold** (`#f0b429`): The marker. It is the highlighter stroke behind a phrase, the signpost tick on the green field, the amount figure on the green field, the focus glow on a form field, the selection wash, the footer link underline on hover, and the Donate fill when Donate sits on the green field or the ink footer. It also carries the two ambient corner washes in the hero and closing field, at 24–30% strength.

### Neutral

- **Warm Paper** (`#fbf8f2`): The document ground; the page background and the resting surface of cards that float over photography.
- **Warm Tint** (`#f1ebdf`): The alternating band and the fill of quiet composed panels (pending states, form disclaimers, success notes).
- **Deep Paper** (`#e7dfd0`): Photographic placeholder ground and the date box of a past event.
- **Warm Ink** (`#17140e`): All body and heading text on paper; also the footer ground and the resting event date box.
- **Soft Ink** (`#6a6252`): Secondary copy — meta lines, notes, ledger years on paper, labels, board bios.
- **Alert** (`#9c2a10`): Field errors, the error banner, and the cancelled-event flag. Never decorative.
- **Rules** (14% ink, 28% ink, 22% field-ink): Hairlines. The 14% rule separates list items and bands; the 28% rule draws input borders and the resting edge of a secondary button; the 22% field-ink rule does the same work inside the green field.

### Named Rules

**The Gold-As-Marker Rule.** Gold marks, it never narrates. Its permitted roles are the highlighter stroke, the signpost tick on the green field, the amount figure on the green field, the focus glow, the selection wash, the hover underline, and the Donate fill on dark grounds. It is never a text colour on paper, never a resting surface in a paper band, and never a large flat area at full strength — the ambient washes sit at 24–30%.

**The Ground Decides the Accent Rule.** A section's ground chooses its accent. On paper and tint, amounts and pillar proof lines are tomato and rules are 14% ink. On the green field, amounts are gold and rules are 22% field-ink. On the tomato field and the ink footer, Donate reverses to paper or gold so it stays the loudest thing present.

**The Tomato Is Action Rule.** Tomato means do something or here is the count: Donate, the named-place proof on the pillars, the amounts on paper, the nav underline, the role line. It never sets body copy, and the one field it grounds carries at most 46ch of text.

## Typography

**Display Font:** Bricolage Grotesque (variable, `opsz` + `wdth` axes; fallback `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Atkinson Hyperlegible (400/700; fallback `ui-sans-serif, system-ui, sans-serif`)

**Character:** A loud, slightly compressed editorial voice paired with the most legible text face available. Bricolage carries every heading, numeral, amount, control, and label; Atkinson carries everything that is actually read. The pairing is deliberately lopsided — headlines shout, copy is calm and generously leaded.

### Hierarchy

- **Hero** (700, `clamp(2.9rem, 9vw, 7.5rem)`, 0.92 line height, -0.045em, `wdth` 88): The home mission headline only, capped at 20–24ch, with photo chips woven into its words.
- **Display** (700, `clamp(2.5rem, 7vw, 5rem)`, 0.96, -0.035em, `wdth` 92): `h1` and inner-route mastheads, capped at 20ch.
- **Headline** (700, `clamp(2rem, 4.6vw, 3.5rem)`, 0.96, -0.035em, `wdth` 92): `h2` — band headings, capped at 22ch, and the closing call to action at 20ch.
- **Statement** (600, `clamp(1.5rem, 3.1vw, 2.5rem)`, 1.14, -0.03em, `wdth` 94): The mission sentence, at 34ch. The one place the display face sets a full sentence, and the only place weight 600 appears.
- **Title** (700, `clamp(1.3rem, 2.2vw, 1.9rem)`, 1.06, -0.025em, `wdth` 92): `h3` — ledger titles, event titles, board names, pending headings; each overrides upward within its own component.
- **Amount** (700, `clamp(1.5rem, 3.6vw, 2.9rem)`, 1.0, -0.04em, `wdth` 90, tabular): Dollar figures in the ledger. The loudest non-heading element on the page.
- **Numeral** (700, `clamp(2.5rem, 6vw, 4.5rem)`, 0.8, -0.05em, `wdth` 88, tabular): The first pillar heading. Later pillars drop one step so the list is unequal without fake index numbers.
- **Lead** (400, `clamp(1.15rem, 1.7vw, 1.45rem)`, 1.5): One sentence under a headline. 34ch beside a hero, 52ch under a masthead, 46ch as a section lede.
- **Body** (400, 1.0625rem, 1.62): All reading copy, capped at 60ch by default and 54–58ch inside mission and event bodies.
- **Small** (400, 0.9375rem, 1.5): Meta lines, notes, hints, bios, footer copy, and a quiet amount label when a figure is not a plain dollar value.
- **Control** (700, 1.02rem, 1.0, -0.01em, `wdth` 100): Buttons, nav links, and form labels (0.95rem in a field label).
- **Label** (700, 0.75rem, 0.14em, uppercase, `wdth` 100): Footer column headings, the cancelled flag, and the caption line inside the next-event card.

### Named Rules

**The Tabular Amount Rule.** Every dollar figure is a tabular display figure (Bricolage 700, `font-variant-numeric: tabular-nums`). A value that is not a plain dollar amount drops to quiet Atkinson small instead, so an unverifiable figure never wears the display weight.

**The Narrow-When-Loud Rule.** The larger the type, the narrower the `wdth` axis and the tighter the tracking: 100% at control and label sizes, 94% at statement, 92% at `h1`–`h3`, 90% at amounts, 88% at hero and index numerals, with tracking moving from -0.01em to -0.05em across the same range.

**The Two-Face Rule.** Bricolage never sets reading copy and Atkinson never sets a heading. Measures are capped in characters, not pixels: 60ch body, 52–56ch notes and summaries, 46ch ledes, 34ch statements and hero leads, 20–24ch headings.

## Layout

A single centred column: `84rem` maximum width with a fluid gutter of `clamp(1.25rem, 5vw, 4rem)`, and a `48rem` narrow container for prose-only routes. Sections are full-bleed horizontal bands that pad `clamp(4rem, 9vw, 8rem)` vertically (the closing call to action doubles to `clamp(5rem, 11vw, 9.5rem)`) and re-centre their own inner column, so a colour change always runs edge to edge while the content stays aligned across bands.

Spacing is an eight-step rhythm from `0.5rem` to a fluid `clamp(5rem, 11vw, 9.5rem)`. Component internals use steps 2–5, component-to-component gaps use 6–7, and the two fluid steps separate a band head from its content and one pillar from the next. A sticky header of `4.25rem` (`4.75rem` from 52rem up) sits translucent over the page at 88% paper with a saturating blur.

Three breakpoints, all in rem: **40rem** turns the photo mosaic into a four-column irregular grid with two double-wide cells, splits form rows into two columns, gives the board a two-column grid, and moves an event photo beside its copy. **52rem** is the main shift — the desktop nav replaces the mobile panel, the hero becomes an asymmetric `1.25fr / 0.75fr` body, the ledger row resolves into three columns (`5rem` year, flexible middle, right-aligned amount), the pillars become a horizontal row of hairline-separated columns, the board goes to three columns, and the footer becomes `1.5fr 1fr 1fr 1fr`. **72rem** gives the first pillar a slightly wider track and a louder heading, and takes the board to four columns.

Mobile is not a narrowed desktop. A ledger row re-flows into a receipt — year and amount share the top line, the object's name sits below — and the header hides its wordmark below 34rem so the seal, Donate, and Menu all stay reachable.

### Named Rules

**The Band, Not the Box Rule.** Structure comes from full-bleed horizontal bands changing ground colour, each re-centring the same `84rem` column. Never nest a coloured container inside a band to fake a section.

**The Unequal Stagger Rule.** Repeating sequences are never a stack of equal rows. The pillars sit in a horizontal row with the first heading a step louder and a slightly wider track from 72rem; the mosaic promotes its first and sixth cells to double-wide squares, and the mosaic photos alternate a -1.1° / +0.9° rotation.

## Elevation & Depth

Near-flat and tonal. Depth comes from warm tonal bands — paper, tint, green field, tomato field, ink footer — and from generous rounding on photography, not from ambient shadows. Shadows exist but are reserved: a photographic panel or a card that floats over one may carry one, and every other surface that needs an edge uses a 1px inset hairline instead of a drop shadow. All three shadows are warm (`rgb(23 20 14 / …)`), never neutral grey, so nothing looks like it was lit by a different room.

### Shadow Vocabulary

- **Resting lift** (`box-shadow: 0 1px 2px rgb(23 20 14 / 0.06), 0 2px 8px -2px rgb(23 20 14 / 0.06)`): Barely there. Mosaic photos, event photos, board portraits, and the resting tomato button.
- **Response lift** (`box-shadow: 0 2px 6px rgb(23 20 14 / 0.07), 0 16px 36px -14px rgb(23 20 14 / 0.22)`): Any button on hover, a hovered mosaic photo, the mobile nav panel, the masthead photograph, the resting photo chip, and the resting next-event card.
- **Hero lift** (`box-shadow: 0 34px 70px -28px rgb(23 20 14 / 0.38)`): The wide hero photograph, and the hover state of the two elements that float over a photograph (the photo chip and the next-event card).
- **Inset hairline** (`box-shadow: inset 0 0 0 1px` with the 14% ink rule): The pending panel, form disclaimer, success panel, board initials placeholder, and empty photo frame. This is how a flat surface gets an edge.

### Named Rules

**The Photograph Earns the Shadow Rule.** Shadows belong to photographs, to elements floating over a photograph, and to hover or focus response. A flat surface that needs definition takes an inset 1px hairline, never a drop shadow.

**The Warm Shadow Rule.** Every shadow is mixed from warm ink (`rgb(23 20 14 / …)`) at 6–38%. No grey, no black, no coloured glow — with the single exception of the focus glow on a form field, which is a 3px gold ring at 45%.

## Shapes

Four radius steps and a pill. **4px** exists only as the geometry of the global focus ring. **10px** is the small-object radius: form fields, date boxes, the skip link, the error banner, the form disclaimer. **18px** is the standard photograph radius — rails, mosaic cells, event photos, and the next-event card that rides a photograph's edge. **28px** is the large-surface radius — wide hero and masthead panels, square board portraits, and composed panels such as the pending state and the success note. Inline photo chips interpolate between the two photographic steps (`clamp(10px, 1.6vw, 18px)`) so a small chip never looks over-rounded.

Interactive controls are pills (`999px`): every button, the cancelled flag, and the circular seal itself. Borders are used sparingly and always as hairlines — a 2px transparent border on buttons so a secondary variant can raise a 28% ink edge without shifting layout, a 1px 28% ink border on fields, and 1px 14% ink rules between list items. Nothing in the system draws a card border.

Two silhouettes recur: the slight tilt (-3° to +1°) that marks anything photographic and hand-placed, and the soft circular ambient wash (a 44–46rem gold radial, clipped by its band) behind the hero and the closing field.

### Named Rules

**The Rounded Photograph Rule.** Every photograph is rounded — 18px in rails and grids, 28px on wide panels and square portraits, interpolated on inline chips. A square-cornered image is a defect.

**The Pill Control Rule.** Anything you click is a pill (`999px`). Anything that holds content is gently rounded (10/18/28px). The two vocabularies never trade places.

## Components

The feel is approachable and civic, never corporate: pill buttons, generously rounded photographs, and rules instead of card borders.

### Buttons

- **Shape:** Full pill (`999px`), minimum 3rem tall, with a 2px transparent border reserved so variants can show an edge without reflow.
- **Primary:** Tomato ground with warm off-white text (`#c6371c` on `#fff8f2`), `0.8rem 1.5rem` padding, resting lift shadow. Hovers to the deep tomato (`#a72c14`).
- **On the green field or the ink footer:** Primary inverts to paper (or gold in the footer) with ink text and hovers to gold, so Donate stays the loudest thing on a loud ground.
- **Hover / Focus:** Every button rises 2px and takes the response lift over 320ms on the decelerating ease; it returns to 0 on `:active`. Focus is a 3px ink outline offset 3px, switching to field-ink over the green field and to flare-ink over the tomato field.
- **Secondary:** Transparent with a 28% ink edge that darkens to full ink on hover over a 5% ink wash.
- **Nav:** Secondary at a reduced 2.75rem height and `0.55rem 1.05rem` padding.
- **Disabled:** Tomato desaturated into deep paper, no lift, no shadow, cursor `not-allowed`. Used for the pending Donate control, which stays a real link to the volunteers rather than a dead button.

### Inputs / Fields

- **Style:** Paper ground, 1px 28% ink border, 10px radius, `0.75rem 0.9rem` padding, 3rem minimum height (9rem for a textarea, vertical resize only). Labels are the display face at 0.95rem/700; an "optional" qualifier drops to Atkinson 400 in soft ink.
- **Focus:** Border goes to full ink and a 3px gold ring at 45% appears outside it; the browser outline is suppressed because the ring replaces it.
- **Error:** Border turns alert red, and the message sits below in alert red 700 behind a small filled circular badge. A form-level failure gets a 10% alert banner on paper with a 35% inset hairline.

### Navigation

- **Desktop:** Inline links at 0.98rem/700 in ink, each with a 2px tomato underline that scales in from the left over 320ms on hover and stays scaled for `aria-current="page"`.
- **Mobile:** Below 52rem the links collapse behind a pill Menu button into an absolutely positioned paper panel below the header, where each link becomes 1.5rem display type separated by 14% ink rules.
- **Header:** Sticky, 88% paper with a saturating 14px blur and a 14% ink bottom rule. The black seal rotates -8° and scales 1.05 on hover of the logo.
- **Footer:** Ink ground with paper text, a four-column grid from 52rem, uppercase label column headings at 60% paper, and links that reveal a gold bottom border on hover.

### Cards / Containers

There is almost no card in this system. The exceptions are the two elements that float over a photograph (the next-event card and the photo chip) and the composed flat panels.

- **Composed panel** (pending state, success note, disclaimer): Warm tint ground, 28px radius (10px for the disclaimer), `3rem 2rem` padding, inset 1px 14% ink hairline, no shadow. Copy capped at 48ch with a wrapped action row below.
- **Never:** A bordered card grid standing in for content. Lists are hairline-ruled rows.

### Ledger Row

The signature component and the reason the system exists. A funded project is one row: the year in small tabular display type, the object's name as a title, a wrapped meta line (category, recipient, beneficiaries), and the amount as a large tabular display figure right-aligned. Rows are separated by hairlines only — 22% field-ink on the green field, 14% ink on paper — with no container, no background, and no border box. On the green field the amount is gold; on paper or tint it is tomato. An amount that is not a plain dollar figure renders as quiet Atkinson small at 18ch instead, right-aligned. On hover or focus-within the whole row slides 0.4rem to the right and the amount scales 1.06, both over 620ms. Below 52rem the row becomes a receipt: year and amount share the top line and the object's name sits beneath them.

### Event Row

A date box, a body, and an optional photograph. The date box is an ink block at 10px radius with uppercase month above a 1.5rem tabular day in paper; hovering the row flips it to tomato, and a past event flips it to deep paper with ink text. The body carries the title, a wrapped meta line, a summary at 58ch, and an optional arrow link. A cancelled event keeps its place with a pill alert flag and a 2px line through its title. Rows are hairline-ruled, three columns from 52rem (`auto / 1.6fr / 0.7fr`).

### Inline Photo Chip

A small photograph set inside a headline: `clamp(3.6rem, 9.5vw, 8.5rem)` wide at 5:4, interpolated radius, response lift, tilted by a per-instance `--chip-tilt` (-3° to +1°) and vertically nudged -0.18em so it sits on the text baseline. On first paint it scales and rotates into place from `scale(0.6) rotate(-9deg)` over 900ms; on hover it counter-rotates 1.6×, scales 1.06, and takes the hero lift. It is decorative by construction and carries an empty alt so the heading's accessible name stays intact.

### Next-Event Card

Paper card at 18px radius riding the lower edge of the hero photograph — pulled up -1.75rem on mobile and -2.5rem from 52rem, indented from the left, tilted -1.2°. Inside, a tomato date chip (uppercase month over a 1.45rem tabular day) sits beside a label line and the event title in 1.08rem display type. On hover it straightens to 0°, lifts 3px, and takes the hero lift.

### Named Rules

**The Rules-Not-Cards Rule.** Every list of records — projects, events, places, footer links — is separated by 1px hairlines and nothing else. No borders, no fills, no boxes per item.

**The Motion-Is-Enhancement Rule.** Content is visible by default. Every animation lives inside `@media (prefers-reduced-motion: no-preference)`, reveals fire once when an element crosses 92% of the viewport height, and a `<noscript>` rule forces every revealable element visible. Easing is exponential deceleration only (`cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.22, 1, 0.36, 1)`) across four durations (180/320/620/900ms). Nothing loops, nothing hijacks the scroll.

## Do's and Don'ts

### Do:

- **Do** stand each section on one of the five grounds (paper `#fbf8f2`, tint `#f1ebdf`, green field `#0e4a2c`, tomato field `#c6371c`, ink footer `#17140e`) and let the ground choose the accent — see The Ground Decides the Accent Rule.
- **Do** set every dollar figure as a tabular Bricolage display figure, and drop non-plain amounts to quiet Atkinson small — see The Tabular Amount Rule.
- **Do** narrow the `wdth` axis and tighten tracking as type gets larger (100% → 88%, -0.01em → -0.05em).
- **Do** round every photograph: 18px in grids and rails, 28px on wide panels and square portraits.
- **Do** separate records with 1px hairlines (14% ink on paper, 22% field-ink on the green field).
- **Do** keep controls as pills and containers as 10/18/28px rounds.
- **Do** cap measures in characters: 60ch body, 46ch ledes, 34ch statements, 20–24ch headings.
- **Do** give launch-dependent content a composed pending panel (tint ground, 28px radius, inset hairline) that states the truth and offers a real next action.
- **Do** wrap every animation in `prefers-reduced-motion: no-preference` and keep the `<noscript>` visibility guarantee.
- **Do** stagger repeating sequences so they read as unequal — indents, spans, alternating tilts.

### Don't:

- **Don't** use flat municipal colour bands.
- **Don't** set timid, undersized type. The hero reaches 7.5rem and amounts reach 2.9rem for a reason.
- **Don't** build a 50/50 split hero. The hero body is asymmetric (`1.25fr / 0.75fr`) with a full-width photograph beneath it.
- **Don't** present three matching equal impact cards. The pillars are a horizontal row: hairline columns, a louder first heading, named-place proof in tomato, and a short reading line.
- **Don't** let metric tiles stand in for evidence. Named objects, years, and amounts are the evidence.
- **Don't** reach for a generic card grid or the shadcn look.
- **Don't** use glassmorphism, blobs, or gradient decoration beyond the two clipped gold ambient washes.
- **Don't** scroll-jack, loop an animation, or gate content behind JavaScript.
- **Don't** put gold on paper as a text colour or a resting surface — see The Gold-As-Marker Rule.
- **Don't** draw a card border or nest a coloured container inside a band to fake a section.
- **Don't** use a grey or black shadow; all shadows are warm ink at 6–38%.
- **Don't** invent aggregate claims or filler content to make a layout look full.
