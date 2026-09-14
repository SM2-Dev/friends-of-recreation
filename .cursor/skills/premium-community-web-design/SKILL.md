---
name: premium-community-web-design
description: Design, implement, or substantially refine Friends of Recreation pages using project-specific art direction, authentic community storytelling, Next.js and Payload constraints, and an Impeccable review pass. Use for new pages, major sections, reference-led design, or visual reviews; do not invoke for tiny copy-only or mechanical code edits.
---

# Premium community web design

Create work that feels specifically art-directed for Saratoga Springs Friends of Recreation while remaining maintainable, accessible, and faithful to the implementation brief.

## Load the right context

Read:

- [project-brief.md](references/project-brief.md) for product scope, page priorities, and content architecture.
- [reference-dna.md](references/reference-dna.md) when establishing or revising art direction from the supplied inspiration sites.
- [quality-bar.md](references/quality-bar.md) for substantial implementation and final critique.
- [impeccable-workflow.md](references/impeccable-workflow.md) when Impeccable is installed or the user requests an Impeccable pass.

Also inspect the current repository before proposing changes: global CSS, Tailwind configuration, fonts, assets, components, route structure, Payload schemas, generated types, and representative pages. Treat the repository and approved brand assets as the source of truth when they are more specific than these references.

## Establish direction before code

For a new page or major redesign, first state:

- three brand adjectives
- one dominant visual idea
- two to four repeatable visual devices
- typography strategy
- photography strategy
- color and shape strategy
- page rhythm
- mobile adaptation
- generic patterns to avoid for this page

Do not start implementation until these decisions form a coherent direction. Ask only for missing information that materially changes the result. Do not invent final colors, fonts, imagery, or content when brand assets are unavailable.

## Compose and implement

Build the page as a connected composition. Use content priority, image scale, type, alignment, color fields, and negative space before decorative effects. Preserve purposeful irregularity without harming comprehension.

Follow the project's established engineering patterns. Keep fixed route templates, structured Payload data, server rendering, generated types, accessible forms, image optimization, and private submission fields intact.

Use temporary placeholders only when necessary and label them in code or CMS seed data so they cannot be mistaken for approved facts.

## Review

Render the result at representative mobile, tablet, and desktop sizes. Review the first two viewport heights and every important interaction or content state.

When Impeccable is installed, run the targeted workflow in [impeccable-workflow.md](references/impeccable-workflow.md). Then apply the Friends of Recreation quality gate. Fix high-impact issues and preserve intentional, accessible brand decisions when a generic recommendation conflicts.

Report the chosen direction, implementation outcome, checks performed, and any remaining asset or content dependencies.

