# Friends of Recreation project brief

## Intent

Build a small, polished brochure website for Saratoga Springs Friends of Recreation. It should launch quickly, be easy for non-technical board members to maintain, and remain extensible through structured Payload content rather than a page builder.

## Public pages

| Page | Route | Primary job |
| --- | --- | --- |
| Home | `/` | Explain mission, prove impact, feature organizations/projects/events, invite donations, collect questions |
| Board Members | `/board-members` | Present the current volunteer board with optional bios and links |
| Events | `/events` | Separate upcoming and past events; link externally where appropriate |
| Projects & Grants | `/projects-grants` | Tell the strongest impact stories and collect grant requests |

## Homepage content priority

1. Mission and primary Donate action.
2. Concrete community impact.
3. Supported recreation organizations, programs, and facilities.
4. Three to four featured projects.
5. Next three upcoming events.
6. Donation CTA and contact form.

Suggested hero message: "Building More Opportunities to Play in Saratoga Springs." Treat supplied copy as a starting point, not approved final brand language.

## Core content model

Collections: Users, Media, BoardMembers, Events, Projects, Organizations, ContactSubmissions, GrantRequests.

Globals: SiteSettings, HomePage, PageContent.

Public content uses drafts or versions where appropriate. Admins manage users and settings; Editors manage public content and submissions without security access.

## Important behaviors

- Upcoming events use `endDate`, or `startDate` when no end date exists, compared with today.
- Upcoming sorts ascending; past sorts descending.
- Empty upcoming-events copy is CMS-controlled and may direct visitors to Facebook.
- Contact and grant forms validate server-side, apply spam protection, persist to Payload, and notify the configured address.
- Internal submission status and notes must never reach the public frontend.
- Donations remain on an external configured URL.
- Production media uses permanent object storage.

## Design direction

Local, active, positive, community-driven, youth-focused, image-led, and easy to use. Use authentic Saratoga Springs photography. Avoid government-portal formality and generic nonprofit or SaaS patterns. Derive final colors from approved logo assets.

## Launch dependencies

The organization must confirm its logo and colors, current board roster, headshots, donation URL and instructions, contact destinations, public project history, event records, supported organizations, authentic photography, and social URLs. Do not infer these details.

