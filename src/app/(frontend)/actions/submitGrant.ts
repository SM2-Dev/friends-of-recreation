'use server'

import { getPayloadClient } from '@/lib/cms'
import { honeypotFilled } from '@/lib/contact'
import { readGrantValues, validateGrant } from '@/lib/grant'
import { initialGrantState, type GrantFormState } from '@/lib/grantState'
import { notifyStaffOfGrantRequest } from '@/lib/notify'

export async function submitGrantRequest(
  _previous: GrantFormState,
  formData: FormData,
): Promise<GrantFormState> {
  const values = readGrantValues(formData)

  if (honeypotFilled(formData)) {
    return { status: 'success', values: initialGrantState.values, fieldErrors: {} }
  }

  const fieldErrors = validateGrant(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', values, fieldErrors }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'grant-requests',
      data: {
        organizationName: values.organizationName,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone || null,
        website: values.website || null,
        projectTitle: values.projectTitle,
        beneficiaries: values.beneficiaries || null,
        description: values.request,
        recreationImpact: values.recreationImpact || null,
        requestedTimeline: values.requestedTimeline || null,
        amountRequested: values.amountRequested || null,
        status: 'new',
      },
    })

    const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })

    await notifyStaffOfGrantRequest({
      organizationName: values.organizationName,
      contactName: values.contactName,
      email: values.email,
      projectTitle: values.projectTitle,
      to: settings.notificationEmail,
    })
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
