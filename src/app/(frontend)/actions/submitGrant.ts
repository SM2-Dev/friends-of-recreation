'use server'

import { getPayloadClient } from '@/lib/cms'
import { honeypotFilled } from '@/lib/contact'
import { readGrantPdf, readGrantValues, validateGrant, validateGrantPdf } from '@/lib/grant'
import { initialGrantState, type GrantFormState } from '@/lib/grantState'
import { confirmGrantSubmitter, notifyStaffOfGrantRequest } from '@/lib/notify'
import { verifyTurnstile } from '@/lib/turnstile'

export async function submitGrantRequest(
  _previous: GrantFormState,
  formData: FormData,
): Promise<GrantFormState> {
  const values = readGrantValues(formData)
  const pdf = readGrantPdf(formData)

  if (honeypotFilled(formData)) {
    return { status: 'success', values: initialGrantState.values, fieldErrors: {} }
  }

  const fieldErrors = validateGrant(values)
  const pdfError = validateGrantPdf(pdf)
  if (pdfError) fieldErrors.attachment = pdfError

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', values, fieldErrors }
  }

  const spamCheck = await verifyTurnstile(formData)
  if (spamCheck !== true) {
    return { status: 'error', values, fieldErrors: {}, formError: spamCheck }
  }

  try {
    const payload = await getPayloadClient()
    let attachmentId: number | undefined

    if (pdf) {
      const created = await payload.create({
        collection: 'media',
        overrideAccess: true,
        data: {
          alt: 'Grant request PDF',
          visibility: 'internal',
          decorative: false,
          mimeType: 'application/pdf',
        },
        file: {
          data: Buffer.from(await pdf.arrayBuffer()),
          mimetype: 'application/pdf',
          name: pdf.name.replace(/[^\w.\- ]+/g, '') || 'grant-request.pdf',
          size: pdf.size,
        },
      })
      attachmentId = created.id
    }

    await payload.create({
      collection: 'grant-requests',
      overrideAccess: true,
      data: {
        organizationName: values.organizationName,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        website: values.website || null,
        projectTitle: values.projectTitle,
        beneficiaries: values.beneficiaries || null,
        description: values.request,
        recreationImpact: values.recreationImpact || null,
        requestedTimeline: values.requestedTimeline || null,
        amountRequested: values.amountRequested || null,
        attachment: attachmentId,
        status: 'new',
      },
    })

    const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })

    await notifyStaffOfGrantRequest({
      organizationName: values.organizationName,
      contactName: values.contactName,
      email: values.email,
      projectTitle: values.projectTitle,
      request: values.request,
      to: settings.notificationEmail,
    })

    try {
      await confirmGrantSubmitter({
        contactName: values.contactName,
        email: values.email,
        organizationName: values.organizationName,
        projectTitle: values.projectTitle,
      })
    } catch {
      // The board already has the request; skip a failed confirmation.
    }
  } catch {
    return {
      status: 'error',
      values,
      fieldErrors: {},
      formError:
        'Your request could not be sent. Please try again, or contact the board directly if the problem continues.',
    }
  }

  return { status: 'success', values: initialGrantState.values, fieldErrors: {} }
}
