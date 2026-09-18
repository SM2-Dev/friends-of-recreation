'use client'

import { useActionState, useEffect, useId, useRef } from 'react'

import { Button } from '@/components/Button'
import { initialCmsAccessState, openCms } from '@/app/(frontend)/actions/openCms'

export function CmsAccessForm() {
  const [state, action, pending] = useActionState(openCms, initialCmsAccessState)
  const formId = useId().replace(/:/g, '')
  const errorRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (state.status === 'error') errorRef.current?.focus()
  }, [state])

  return (
    <form action={action} aria-labelledby={`${formId}-heading`} className="contact-form" noValidate>
      <header className="contact-form-intro">
        <h1 id={`${formId}-heading`}>Open the CMS</h1>
        <p>
          Payload&apos;s own login screen is blank on this Next.js version. Sign in here first.
          After a successful sign-in you will land on the dashboard, where you can upload photos
          and edit pages.
        </p>
      </header>

      <div className="form-grid">
        <fieldset className="form-field">
          <legend className="visually-hidden">Account action</legend>
          <label>
            <input defaultChecked name="mode" type="radio" value="login" /> Sign in
          </label>
          <label>
            <input name="mode" type="radio" value="create" /> Create the first admin
          </label>
        </fieldset>

        <div className="form-field">
          <label htmlFor="cms-email">Email</label>
          <input autoComplete="username" id="cms-email" name="email" required type="email" />
        </div>

        <div className="form-field">
          <label htmlFor="cms-password">Password</label>
          <input
            autoComplete="current-password"
            id="cms-password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </div>
      </div>

      {state.status === 'error' && state.formError ? (
        <p
          className="form-error form-error-banner"
          id={`${formId}-error`}
          ref={errorRef}
          role="alert"
          tabIndex={-1}
        >
          {state.formError}
        </p>
      ) : null}

      <Button busy={pending} disabled={pending} type="submit">
        Continue to the dashboard
      </Button>
    </form>
  )
}
