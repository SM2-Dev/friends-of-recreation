'use server'

import { getPayloadClient } from '@/lib/cms'
import {
  honeypotFilled,
  readContactValues,
  validateContact,
} from '@/lib/contact'
import { initialContactState, type ContactFormState } from '@/lib/contactState'
import { confirmContactSubmitter, notifyStaffOfContact } from '@/lib/notify'
import { verifyTurnstile } from '@/lib/turnstile'

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

  const spamCheck = await verifyTurnstile(formData)
  if (spamCheck !== true) {
    return {
      status: 'error',
      values,
      fieldErrors: {},
      formError: spamCheck,
    }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      overrideAccess: true,
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
      message: values.message,
      to: settings.notificationEmail,
    })

    try {
      await confirmContactSubmitter({
        name: values.name,
        email: values.email,
        subject: values.subject,
      })
    } catch {
      // The board already has the message; skip a failed confirmation.
    }
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
