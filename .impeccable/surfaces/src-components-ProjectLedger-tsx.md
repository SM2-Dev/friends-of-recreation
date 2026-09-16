---
version: 1
slug: "src-components-ProjectLedger-tsx"
primary_target: "src/components/ProjectLedger.tsx"
related_targets:
  - "src/components/PageLayout.tsx"
  - "src/components/LedgerRow.tsx"
  - "src/app/(frontend)/globals.css"
  - "src/collections/Projects.ts"
  - "src/seed/development.ts"
---

# Projects & Grants — /projects-grants

Mode: Persuade.

Audience: Donors and local businesses deciding whether this group is real; grant seekers who need to see what has already been funded; families arriving from Facebook.
Job: make impact tangible — what was funded, when, who benefited, and how much — then invite a grant request or a donation.
Action: request grant support, or Donate.
Proof: published CMS project records only. Starter history is brief-supplied and pending board confirmation.
Constraints: no invented amounts, photos, or aggregate totals; no project-detail pages; no card grid; keep the grant form and external Donate.

## Direction contract

THESIS: This page is a town record of funded objects, grouped by year, not a spreadsheet and not a stack of equal grant cards. Newest single-year gifts read as editorial entries; years with several gifts become a chapter with the year set once as a display numeral.

OWN-WORLD: Warm paper masthead, tint category scan, deep green field for the ledger, paper for the grant form, tomato Donate close. Bricolage years and amounts, Atkinson summaries. Gold amounts on the green field. Hairline rules, no card borders. Five client categories as a scan with the latest published object as proof, never icon tiles or filters.

STORY: Masthead (“See Your Support in Action”) → what we fund → the year-chaptered record, newest first → grant request → Donate.

FIRST VIEWPORT: Shared inner masthead with the client headline and intro. Directly under it, the five categories in a hairline scan so a phone visitor sees mission, then the kinds of projects, then 2026 as the first ledger entry without scrolling past a table header.

FORM: Year-chaptered community ledger. Precisely specified client request; no concept-seed. Signature interaction: ledger rows and year features slide 0.4rem on hover/focus; amounts scale 1.06; gold stays the amount colour on the green field.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
