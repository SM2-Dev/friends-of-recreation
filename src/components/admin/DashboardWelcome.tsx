import type { Payload, ServerProps } from 'payload'

import { getAdminBrand } from './brand'

type NewSubmissions = {
  contact: number
  grants: number
}

async function countNewSubmissions(
  payload: Payload | undefined,
  user: ServerProps['user'],
): Promise<NewSubmissions> {
  if (!payload) return { contact: 0, grants: 0 }

  const countNew = async (collection: 'contact-submissions' | 'grant-requests') => {
    try {
      const { totalDocs } = await payload.count({
        collection,
        disableErrors: true,
        overrideAccess: false,
        req: { user: user ?? null },
        where: { status: { equals: 'new' } },
      })
      return totalDocs || 0
    } catch {
      return 0
    }
  }

  const [contact, grants] = await Promise.all([
    countNew('contact-submissions'),
    countNew('grant-requests'),
  ])

  return { contact, grants }
}

function plural(count: number, singular: string, pluralWord: string) {
  return `${count} ${count === 1 ? singular : pluralWord}`
}

/**
 * Orientation panel above the dashboard cards. Board members sign in
 * infrequently, so this names the two things they most often came to do and
 * flags anything waiting in the form inboxes.
 */
export async function DashboardWelcome({ payload, user }: ServerProps) {
  const brand = await getAdminBrand(payload)
  const adminRoute = payload?.config?.routes?.admin || '/admin'
  const { contact, grants } = await countNewSubmissions(payload, user)

  const waiting: string[] = []
  if (contact > 0) waiting.push(plural(contact, 'new contact message', 'new contact messages'))
  if (grants > 0) waiting.push(plural(grants, 'new grant request', 'new grant requests'))

  return (
    <section className="fo-welcome">
      <p className="fo-welcome__eyebrow">{brand.siteName}</p>
      <h1 className="fo-welcome__title">Everything on the public site is edited here.</h1>
      <p className="fo-welcome__body">
        Add events, record funded projects and grants, and keep board members and page sections
        current. Published changes reach the live site right away.
        {waiting.length > 0 ? ` Waiting for you: ${waiting.join(' and ')}.` : ''}
      </p>
      <div className="fo-welcome__actions">
        <a className="fo-welcome__action" href={`${adminRoute}/collections/events/create`}>
          Add an event
        </a>
        <a className="fo-welcome__action" href={`${adminRoute}/collections/projects/create`}>
          Add a project
        </a>
        {waiting.length > 0 ? (
          <a
            className="fo-welcome__action fo-welcome__action--quiet"
            href={`${adminRoute}/collections/${contact > 0 ? 'contact-submissions' : 'grant-requests'}`}
          >
            Review submissions
          </a>
        ) : null}
      </div>
    </section>
  )
}

export default DashboardWelcome
