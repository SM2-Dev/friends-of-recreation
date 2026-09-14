'use server'

import { getPayloadClient } from '@/lib/cms'
import {
  honeypotFilled,
  readContactValues,
  validateContact,
} from '@/lib/contact'
import { initialContactState, type ContactFormState } from '@/lib/contactState'
import { notifyStaffOfContact } from '@/lib/notify'

export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = readContactValues(formData)

  if (honeypotFilled(formData)) {
    return {
      status: 'success',
      values: initialContactState.values,
      fieldErrors: {},
    }
  }

  const fieldErrors = validateContact(values)
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      values,
      fieldErrors,
    }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        subject: values.subject,
        message: values.message,
        status: 'new',
      },
    })

    const settings = await payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: true,
    })

    await notifyStaffOfContact({
      name: values.name,
      email: values.email,
      subject: values.subject,
      to: settings.notificationEmail,
    })
  } catch {
    return {
      status: 'error',
      values,
      fieldErrors: {},
      formError: 'Your message could not be sent. Please try again, or email us if the problem continues.',
    }
  }

  return {
    status: 'success',
    values: initialContactState.values,
    fieldErrors: {},
  }
}
