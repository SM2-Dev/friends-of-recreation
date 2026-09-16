# Friends of Recreation — product truth

## What this is

A four-page brochure website for **Saratoga Springs Friends of Recreation**, a volunteer-led
organization that raises money so recreation in Saratoga Springs, New York gets better: playgrounds,
athletic fields, ice rinks, youth equipment, camps, scholarships, and community projects.

Source of truth for scope and content: `Friends_of_Recreation_Website_Implementation_Brief.docx`
(revision September 11, 2026), summarized in
`.cursor/skills/premium-community-web-design/references/project-brief.md`.

## Platform

Next.js App Router + Payload CMS 3 in one repository, TypeScript, Postgres, Tailwind v4 present but
the site is authored in plain CSS. Public routes are server components reading through the Payload
Local API. Payload admin lives at `/admin`.

## Users

- **Saratoga Springs families**, mostly arriving on a phone from a Facebook post or an event link.
  They want the next event, and they want to know this group is real.
- **Donors and local businesses** deciding whether this organization deserves money. They want proof:
  what was funded, when, for whom, for how much.
- **Partner organizations and grant seekers** who want to ask for support.
- **Volunteer board members** who maintain content in Payload and cannot be expected to touch code.

## Purpose

Communicate the mission on the first screen, make past impact tangible, surface upcoming events,
push a highly visible Donate action to an external page, and collect questions and grant requests.

## Positioning

Local, active, positive, community-driven, youth-focused, image-led. Explicitly **not** a government
portal, not a formal foundation, not a generic nonprofit template, not a SaaS marketing page.

## Content model

Collections: `users`, `media`, `board-members`, `events`, `projects`, `organizations`,
`contact-submissions`, `grant-requests`. Globals: `site-settings`, `home-page`, `page-content`.

Fixed, purpose-built page templates. No drag-and-drop page builder.

## Capabilities

- Home: mission, three impact pillars, supported places, featured funded projects, next three
  events, donation CTA, contact form.
- Board Members: active roster in sort order with optional photo, title, bio, link.
- Events: upcoming ascending and past descending, split by `endDate` or `startDate` against today.
  Cancelled events stay visible and marked. No event detail pages.
- Projects & Grants: the full funded history plus a grant request form.
- Contact and grant submissions validate server-side, pass a honeypot, persist to Payload, and
  notify the configured address. Internal status and notes never reach the public frontend.

## Constraints

- **Donations stay external.** The donation URL is a launch dependency. Until the board confirms it,
  the Donate control renders disabled with a visible pending note. Never invent a payment link.
- **Never invent facts.** Board roster, headshots, event records, supported organizations, contact
  addresses, and social URLs are launch dependencies. Empty states stay honest rather than filled
  with plausible fiction.
- Project years, titles, amounts, and named facilities currently on the site come from the
  implementation brief's "Starter public project history" and are **brief-supplied starter content
  pending board confirmation**, not independently verified claims.
- Do not compute new aggregate claims (totals, averages, "X families served") from the project list.
  Derived facts are limited to what is literally in the data: counts, first year, latest year.
- Photography is the organization's own. Do not attach a photo to a specific funded project unless
  the photo actually depicts it.
- Alt text is required on every Media record. Essential text never lives inside an image.
- WCAG 2.2 AA: contrast, focus visibility, keyboard operation, labelled fields, announced errors,
  semantic landmarks, skip link, reduced-motion support.
- Content must render without client JavaScript. Motion is enhancement only.

## Brand commitments

- Approved logo: `public/logo.png` and the `site-settings` logo upload — a **black circular
  brush-script seal** reading "Friends of Recreation / Saratoga Springs, NY". It is monochrome; there
  is no color version. Pair it with a typeset wordmark so the name is legible at small sizes.
- Because the mark is black, the palette is derived from the logo's ink plus the organization's own
  photography: warm paper, warm ink, deep grass green, and a tomato accent that matches the coral
  Friends of Recreation event shirts.
- Approved display face: Bricolage Grotesque. Approved text face: Atkinson Hyperlegible.
