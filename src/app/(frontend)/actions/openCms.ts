'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/cms'

export type CmsAccessState = {
  status: 'idle' | 'error'
  formError?: string
}

export const initialCmsAccessState: CmsAccessState = { status: 'idle' }

function readString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function tokenMaxAge(exp: unknown) {
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return 60 * 60 * 2
  const seconds = Math.floor(exp - Date.now() / 1000)
  return seconds > 60 ? seconds : 60 * 60 * 2
}

export async function openCms(
  _previous: CmsAccessState,
  formData: FormData,
): Promise<CmsAccessState> {
  const email = readString(formData, 'email').toLowerCase()
  const password = readString(formData, 'password')
  const mode = readString(formData, 'mode') === 'create' ? 'create' : 'login'

  if (!email || !email.includes('@')) {
    return { status: 'error', formError: 'Enter a valid email address.' }
  }

  if (password.length < 8) {
    return { status: 'error', formError: 'Password must be at least 8 characters.' }
  }

  try {
    const payload = await getPayloadClient()

    if (mode === 'create') {
      const existing = await payload.find({
        collection: 'users',
        limit: 1,
        overrideAccess: true,
      })

      if (existing.totalDocs > 0) {
        return {
          status: 'error',
          formError: 'An admin already exists. Choose Sign in instead.',
        }
      }

      await payload.create({
        collection: 'users',
        overrideAccess: true,
        data: {
          email,
          password,
          role: 'admin',
        },
      })
    }

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!result.token) {
      return { status: 'error', formError: 'Could not start a CMS session.' }
    }

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'payload-token',
      value: result.token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenMaxAge(result.exp),
    })
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : ''
    if (/invalid|incorrect|authentication|credentials/i.test(message)) {
      return { status: 'error', formError: 'Email or password is incorrect.' }
    }
    return {
      status: 'error',
      formError: message || 'Could not open the CMS.',
    }
  }

  redirect('/admin')
}
