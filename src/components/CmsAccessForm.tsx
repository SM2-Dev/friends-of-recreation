'use client'

import { useId, useState } from 'react'

import { Button } from '@/components/Button'

type Mode = 'login' | 'create'

function apiMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback
  const body = payload as { message?: unknown; errors?: Array<{ message?: unknown }> }
  if (typeof body.message === 'string' && body.message.trim()) return body.message
  const first = body.errors?.[0]?.message
  if (typeof first === 'string' && first.trim()) return first
  return fallback
}

export function CmsAccessForm() {
  const formId = useId().replace(/:/g, '')
  const [mode, setMode] = useState<Mode>('create')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      if (mode === 'create') {
        const created = await fetch('/api/users', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const createdBody = await created.json().catch(() => null)
        if (!created.ok) {
          throw new Error(apiMessage(createdBody, 'Could not create the first admin user.'))
        }
      }

      const login = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const loginBody = await login.json().catch(() => null)
      if (!login.ok) {
        throw new Error(apiMessage(loginBody, 'Could not log in.'))
      }

      window.location.assign('/admin')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong.')
      setPending(false)
    }
  }

  return (
    <form aria-labelledby={`${formId}-heading`} className="contact-form" onSubmit={submit} noValidate>
      <header className="contact-form-intro">
        <h1 id={`${formId}-heading`}>Open the CMS</h1>
        <p>
          Payload&apos;s own /admin login is blank on this Next.js version. Use this page to create the first
          admin or sign in. After that, Media, Pages, and the rest of the dashboard will load.
        </p>
      </header>

      <div className="form-grid">
        <fieldset className="form-field">
          <legend className="visually-hidden">Account action</legend>
          <label>
            <input
              checked={mode === 'create'}
              name="cms-mode"
              onChange={() => setMode('create')}
              type="radio"
              value="create"
            />{' '}
            Create the first admin
          </label>
          <label>
            <input
              checked={mode === 'login'}
              name="cms-mode"
              onChange={() => setMode('login')}
              type="radio"
              value="login"
            />{' '}
            Sign in
          </label>
        </fieldset>

        <div className="form-field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input
            autoComplete="username"
            id={`${formId}-email`}
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-password`}>Password</label>
          <input
            autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
            id={`${formId}-password`}
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
      </div>

      {error ? (
        <p className="form-error form-error-banner" role="alert">
          {error}
        </p>
      ) : null}

      <Button busy={pending} disabled={pending} type="submit">
        {mode === 'create' ? 'Create admin and continue' : 'Sign in and continue'}
      </Button>
    </form>
  )
}
