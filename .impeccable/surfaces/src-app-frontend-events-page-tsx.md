---
version: 1
slug: "src-app-frontend-events-page-tsx"
primary_target: "src/app/(frontend)/events/page.tsx"
related_targets: ["src/components/EventRow.tsx"]
---

# Events page

Mode: Read.

Audience: Saratoga Springs families arriving from Facebook or the homepage, looking for the next gathering.
Job: scan upcoming events, learn when and where, leave to the right destination; browse past events as proof this group actually gathers.
Action: follow the external CTA.
Proof: published CMS event records only — title, dates, optional time, location, summary, optional photograph, optional URL, cancelled flag.
Constraints: no event-detail pages; do not invent events or photos; keep the shared inner-page masthead; empty upcoming copy is CMS-controlled and may send people to Facebook.

## Direction contract

THESIS: The calendar is a ruled town ledger of gatherings, not a ticket-card grid and not a featured photograph with leftovers underneath. Each event is one hairline row: a date stamp, the facts a family needs, and a photograph only when that event owns one.

OWN-WORLD: Warm paper for upcoming, warm tint for the archive, ink date boxes that flip tomato on hover, deep-paper date boxes for past, Bricolage titles, Atkinson facts. Photographs are optional 5:4 plates at 18px radius. External destinations use a ↗ arrow plus a spoken “leaves this website” note. Cancelled stays in place with an alert pill and a struck title.

STORY: Untouched masthead → Upcoming, soonest first (or an honest empty panel with Facebook) → Past, newest first → Donate.

FIRST VIEWPORT: The existing masthead stays. Directly under it, “Upcoming events” and the first ruled row, so the next gathering is visible without a featured ticket card. On a phone the date stamp and title lead, then the photograph if there is one; from 52rem the row is date / facts / photograph.

FORM: Equal ruled rows, confirmed with the user. Precisely specified request; no concept-seed. Signature interaction: the date box flips from ink to tomato on hover and focus; event photographs rest at a slight alternating tilt.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
