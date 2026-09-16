/**
 * Integration boundary: outbound email and spam protection.
 *
 * Contact submissions are stored in Payload regardless of these env vars.
 * Do not treat a saved submission as a delivered email.
 *
 * Configure:
 * - NOTIFICATION_FROM
 * - RESEND_API_KEY
 * - NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY
 */
export type NotificationResult =
  | { sent: true }
  | { sent: false; reason: 'not-configured' | 'missing-recipient' | 'provider-error' }

export function mailProviderConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFICATION_FROM)
}

export { turnstileConfigured } from '@/lib/turnstile'

async function sendResendEmail(input: {
  to: string
  subject: string
  text: string
  replyTo?: string
}): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.NOTIFICATION_FROM
  if (!apiKey || !from) return { sent: false, reason: 'not-configured' }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    })

    if (!response.ok) return { sent: false, reason: 'provider-error' }
    return { sent: true }
  } catch {
    return { sent: false, reason: 'provider-error' }
  }
}

export async function notifyStaffOfContact(input: {
  name: string
  email: string
  subject: string
  message: string
  to?: string | null
}): Promise<NotificationResult> {
  const to = input.to?.trim()
  if (!to) return { sent: false, reason: 'missing-recipient' }

  return sendResendEmail({
    to,
    replyTo: input.email,
    subject: `Contact form: ${input.subject}`,
    text: [
      `${input.name} <${input.email}> sent a question through the Friends of Recreation website.`,
      '',
      `Subject: ${input.subject}`,
      '',
      input.message,
    ].join('\n'),
  })
}

export async function notifyStaffOfGrantRequest(input: {
  organizationName: string
  contactName: string
  email: string
  projectTitle: string
  request: string
  to?: string | null
}): Promise<NotificationResult> {
  const to = input.to?.trim()
  if (!to) return { sent: false, reason: 'missing-recipient' }

  return sendResendEmail({
    to,
    replyTo: input.email,
    subject: `Grant request: ${input.projectTitle}`,
    text: [
      `${input.contactName} from ${input.organizationName} submitted a grant request.`,
      '',
      `Project: ${input.projectTitle}`,
      `Email: ${input.email}`,
      '',
      input.request,
    ].join('\n'),
  })
}

export async function confirmContactSubmitter(input: {
  name: string
  email: string
  subject: string
}): Promise<NotificationResult> {
  const to = input.email.trim()
  if (!to) return { sent: false, reason: 'missing-recipient' }

  return sendResendEmail({
    to,
    subject: 'We received your message — Friends of Recreation',
    text: [
      `Hi ${input.name},`,
      '',
      'Thanks for writing to Friends of Recreation. We received your message and a volunteer will follow up if a reply is needed.',
      '',
      `Subject: ${input.subject}`,
      '',
      'Friends of Recreation',
      'Saratoga Springs, New York',
    ].join('\n'),
  })
}

export async function confirmGrantSubmitter(input: {
  contactName: string
  email: string
  organizationName: string
  projectTitle: string
}): Promise<NotificationResult> {
  const to = input.email.trim()
  if (!to) return { sent: false, reason: 'missing-recipient' }

  return sendResendEmail({
    to,
    subject: 'We received your grant request — Friends of Recreation',
    text: [
      `Hi ${input.contactName},`,
      '',
      `Thanks for writing to Friends of Recreation. We received the request from ${input.organizationName} for ${input.projectTitle}.`,
      '',
      'Submitting a request does not guarantee funding. A member of Friends of Recreation will contact you if additional information is needed.',
      '',
      'Friends of Recreation',
      'Saratoga Springs, New York',
    ].join('\n'),
  })
}
