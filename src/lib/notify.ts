/**
 * Integration boundary: outbound email and spam protection.
 *
 * Contact submissions are stored in Payload regardless of these env vars.
 * Do not treat a saved submission as a delivered email.
 *
 * Configure later, then implement a real provider in this module:
 * - NOTIFICATION_FROM
 * - RESEND_API_KEY or SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
 * - NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY
 */
export type NotificationResult = {
  sent: false
  reason: 'not-configured'
}

export function mailProviderConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST)
}

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
}

export async function notifyStaffOfContact(_input: {
  name: string
  email: string
  subject: string
  to?: string | null
}): Promise<NotificationResult> {
  return { sent: false, reason: 'not-configured' }
}
