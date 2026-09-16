'use client'

import { useActionState, useEffect, useId, useRef } from 'react'

import { Button } from '@/components/Button'
import { TurnstileField } from '@/components/TurnstileField'
import { submitContact } from '@/app/(frontend)/actions/submitContact'
import type { ContactField } from '@/lib/contact'
import { initialContactState } from '@/lib/contactState'

type ContactFormProps = {
  heading: string
  headingId?: string
  intro?: string | null
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p className="form-error" id={id}>
      {message}
    </p>
  )
}

export function ContactForm({ heading, headingId, intro }: ContactFormProps) {
  const [state, action, pending] = useActionState(submitContact, initialContactState)
  const generatedId = useId()
  const formId = generatedId.replace(/:/g, '')
  const titleId = headingId || `${formId}-heading`
  const successRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fieldErrors = state.fieldErrors ?? {}
  const values = state.values ?? initialContactState.values

  useEffect(() => {
    if (state.status === 'success') {
      successRef.current?.focus()
      return
    }

    if (state.status !== 'error') return

    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    invalid?.focus()
  }, [state])

  const describedBy = (field: ContactField) => {
    const errorId = `${formId}-${field}-error`
    return fieldErrors[field] ? errorId : undefined
  }

  if (state.status === 'success') {
    return (
      <div className="contact-success" ref={successRef} role="status" tabIndex={-1}>
        <h2 id={titleId}>{heading}</h2>
        <p>Thank you. Your message was saved for the Friends of Recreation board. We will follow up if a reply is needed.</p>
      </div>
    )
  }

  return (
    <form
      action={action}
      aria-describedby={
        [intro ? `${formId}-intro` : undefined, state.formError ? `${formId}-form-error` : undefined]
          .filter(Boolean)
          .join(' ') || undefined
      }
      aria-labelledby={titleId}
      className="contact-form"
      noValidate
      ref={formRef}
    >
      <header className="contact-form-intro">
        <h2 id={titleId}>{heading}</h2>
        {intro ? <p id={`${formId}-intro`}>{intro}</p> : null}
      </header>

      {state.formError ? (
        <p className="form-error form-error-banner" id={`${formId}-form-error`} role="alert">
          {state.formError}
        </p>
      ) : null}

      <div aria-hidden="true" className="form-honeypot">
        <input aria-hidden="true" autoComplete="off" name="company" tabIndex={-1} />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input
            aria-describedby={describedBy('name')}
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="name"
            defaultValue={values.name}
            id={`${formId}-name`}
            name="name"
            required
          />
          <FieldError id={`${formId}-name-error`} message={fieldErrors.name} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input
            aria-describedby={describedBy('email')}
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            defaultValue={values.email}
            id={`${formId}-email`}
            name="email"
            required
            type="email"
          />
          <FieldError id={`${formId}-email-error`} message={fieldErrors.email} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-phone`}>
            Phone <span className="form-optional">(optional)</span>
          </label>
          <input
            aria-describedby={describedBy('phone')}
            aria-invalid={Boolean(fieldErrors.phone)}
            autoComplete="tel"
            defaultValue={values.phone}
            id={`${formId}-phone`}
            name="phone"
            type="tel"
          />
          <FieldError id={`${formId}-phone-error`} message={fieldErrors.phone} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-subject`}>Subject</label>
          <input
            aria-describedby={describedBy('subject')}
            aria-invalid={Boolean(fieldErrors.subject)}
            defaultValue={values.subject}
            id={`${formId}-subject`}
            name="subject"
            required
          />
          <FieldError id={`${formId}-subject-error`} message={fieldErrors.subject} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-message`}>Message</label>
        <textarea
          aria-describedby={describedBy('message')}
          aria-invalid={Boolean(fieldErrors.message)}
          defaultValue={values.message}
          id={`${formId}-message`}
          name="message"
          required
          rows={6}
        />
        <FieldError id={`${formId}-message-error`} message={fieldErrors.message} />
      </div>

      <TurnstileField resetSignal={state.status} />

      <Button busy={pending} disabled={pending} type="submit">
        {pending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
