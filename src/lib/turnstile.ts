export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
}

export async function verifyTurnstile(formData: FormData): Promise<true | string> {
  if (!turnstileConfigured()) return true

  const token = String(formData.get('cf-turnstile-response') || '').trim()
  if (!token) return 'Please complete the spam check and try again.'

  try {
    const body = new URLSearchParams()
    body.set('secret', process.env.TURNSTILE_SECRET_KEY || '')
    body.set('response', token)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    const result = (await response.json()) as { success?: boolean }
    if (!result.success) return 'The spam check could not be verified. Please try again.'
    return true
  } catch {
    return 'The spam check could not be verified. Please try again.'
  }
}
