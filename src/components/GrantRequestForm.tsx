'use client'

import { useActionState, useEffect, useId, useRef } from 'react'

import { Button } from '@/components/Button'
import { TurnstileField } from '@/components/TurnstileField'
import { submitGrantRequest } from '@/app/(frontend)/actions/submitGrant'
import type { GrantField } from '@/lib/grant'
import { initialGrantState } from '@/lib/grantState'

type GrantRequestFormProps = {
  heading: string
  headingId?: string
  intro?: string | null
  showHeading?: boolean
}

const DISCLAIMER =
  'Submitting a request does not guarantee funding. A member of Friends of Recreation will contact you if additional information is needed.'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p className="form-error" id={id}>
      {message}
    </p>
  )
}

export function GrantRequestForm({
  heading,
  headingId,
  intro,
  showHeading = true,
}: GrantRequestFormProps) {
  const [state, action, pending] = useActionState(submitGrantRequest, initialGrantState)
  const generatedId = useId()
  const formId = generatedId.replace(/:/g, '')
  const titleId = headingId || `${formId}-heading`
  const successRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fieldErrors = state.fieldErrors ?? {}
  const values = state.values ?? initialGrantState.values

  useEffect(() => {
    if (state.status === 'success') {
      successRef.current?.focus()
      return
    }

    if (state.status !== 'error') return

    const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    invalid?.focus()
  }, [state])

  const errorId = (field: GrantField | 'attachment') => `${formId}-${field}-error`
  const describedBy = (field: GrantField | 'attachment', extra?: string) => {
    const ids = [fieldErrors[field] ? errorId(field) : undefined, extra].filter(Boolean)
    return ids.length > 0 ? ids.join(' ') : undefined
  }

  if (state.status === 'success') {
    return (
      <div className="contact-success" ref={successRef} role="status" tabIndex={-1}>
        {showHeading ? <h2 id={titleId}>{heading}</h2> : null}
        <p>
          Thank you. Your request was saved for the Friends of Recreation board. A volunteer will
          contact you if more information is needed.
        </p>
        <p className="body-note">{DISCLAIMER}</p>
      </div>
    )
  }

  const attachmentHintId = `${formId}-attachment-hint`
  const disclaimerId = `${formId}-disclaimer`
  const describedIds = [
    intro ? `${formId}-intro` : undefined,
    state.formError ? `${formId}-form-error` : undefined,
    disclaimerId,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <form
      action={action}
      aria-describedby={describedIds || undefined}
      aria-labelledby={titleId}
      className="grant-form"
      encType="multipart/form-data"
      noValidate
      ref={formRef}
    >
      {showHeading || intro ? (
        <header className="grant-form-intro">
          {showHeading ? <h2 id={titleId}>{heading}</h2> : null}
          {intro ? <p id={`${formId}-intro`}>{intro}</p> : null}
        </header>
      ) : null}

      {state.formError ? (
        <p className="form-error form-error-banner" id={`${formId}-form-error`} role="alert">
          {state.formError}
        </p>
      ) : null}

      <div aria-hidden="true" className="form-honeypot">
        <input aria-hidden="true" autoComplete="off" name="company" tabIndex={-1} />
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-field">
          <label htmlFor={`${formId}-organizationName`}>Organization / group name</label>
          <input
            aria-describedby={describedBy('organizationName')}
            aria-invalid={Boolean(fieldErrors.organizationName)}
            autoComplete="organization"
            defaultValue={values.organizationName}
            id={`${formId}-organizationName`}
            name="organizationName"
            required
          />
          <FieldError id={errorId('organizationName')} message={fieldErrors.organizationName} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-contactName`}>Contact name</label>
          <input
            aria-describedby={describedBy('contactName')}
            aria-invalid={Boolean(fieldErrors.contactName)}
            autoComplete="name"
            defaultValue={values.contactName}
            id={`${formId}-contactName`}
            name="contactName"
            required
          />
          <FieldError id={errorId('contactName')} message={fieldErrors.contactName} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-grant-email`}>Email</label>
          <input
            aria-describedby={describedBy('email')}
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            defaultValue={values.email}
            id={`${formId}-grant-email`}
            name="email"
            required
            type="email"
          />
          <FieldError id={errorId('email')} message={fieldErrors.email} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-grant-phone`}>Phone</label>
          <input
            aria-describedby={describedBy('phone')}
            aria-invalid={Boolean(fieldErrors.phone)}
            autoComplete="tel"
            defaultValue={values.phone}
            id={`${formId}-grant-phone`}
            name="phone"
            required
            type="tel"
          />
          <FieldError id={errorId('phone')} message={fieldErrors.phone} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-website`}>
            Organization website <span className="form-optional">(optional)</span>
          </label>
          <input
            aria-describedby={describedBy('website')}
            aria-invalid={Boolean(fieldErrors.website)}
            autoComplete="url"
            defaultValue={values.website}
            id={`${formId}-website`}
            name="website"
            type="url"
          />
          <FieldError id={errorId('website')} message={fieldErrors.website} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-amountRequested`}>Amount requested</label>
          <input
            aria-describedby={describedBy('amountRequested')}
            aria-invalid={Boolean(fieldErrors.amountRequested)}
            defaultValue={values.amountRequested}
            id={`${formId}-amountRequested`}
            name="amountRequested"
          />
          <FieldError id={errorId('amountRequested')} message={fieldErrors.amountRequested} />
        </div>

        <div className="form-field form-span-2">
          <label htmlFor={`${formId}-projectTitle`}>Project / program name</label>
          <input
            aria-describedby={describedBy('projectTitle')}
            aria-invalid={Boolean(fieldErrors.projectTitle)}
            defaultValue={values.projectTitle}
            id={`${formId}-projectTitle`}
            name="projectTitle"
            required
          />
          <FieldError id={errorId('projectTitle')} message={fieldErrors.projectTitle} />
        </div>

        <div className="form-field form-span-2">
          <label htmlFor={`${formId}-request`}>Tell us about your request</label>
          <textarea
            aria-describedby={describedBy('request')}
            aria-invalid={Boolean(fieldErrors.request)}
            defaultValue={values.request}
            id={`${formId}-request`}
            name="request"
            required
            rows={4}
          />
          <FieldError id={errorId('request')} message={fieldErrors.request} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-beneficiaries`}>
            Who will this project benefit? <span className="form-optional">(optional)</span>
          </label>
          <textarea
            aria-describedby={describedBy('beneficiaries')}
            aria-invalid={Boolean(fieldErrors.beneficiaries)}
            className="form-textarea-short"
            defaultValue={values.beneficiaries}
            id={`${formId}-beneficiaries`}
            name="beneficiaries"
            rows={3}
          />
          <FieldError id={errorId('beneficiaries')} message={fieldErrors.beneficiaries} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-recreationImpact`}>
            How will this improve recreation in Saratoga Springs?{' '}
            <span className="form-optional">(optional)</span>
          </label>
          <textarea
            aria-describedby={describedBy('recreationImpact')}
            aria-invalid={Boolean(fieldErrors.recreationImpact)}
            className="form-textarea-short"
            defaultValue={values.recreationImpact}
            id={`${formId}-recreationImpact`}
            name="recreationImpact"
            rows={3}
          />
          <FieldError id={errorId('recreationImpact')} message={fieldErrors.recreationImpact} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-requestedTimeline`}>
            Requested funding date / project timeline{' '}
            <span className="form-optional">(optional)</span>
          </label>
          <input
            aria-describedby={describedBy('requestedTimeline')}
            aria-invalid={Boolean(fieldErrors.requestedTimeline)}
            defaultValue={values.requestedTimeline}
            id={`${formId}-requestedTimeline`}
            name="requestedTimeline"
          />
          <FieldError id={errorId('requestedTimeline')} message={fieldErrors.requestedTimeline} />
        </div>

        <div className="form-field">
          <label htmlFor={`${formId}-attachment`}>
            Supporting document <span className="form-optional">(optional PDF)</span>
          </label>
          <input
            accept="application/pdf,.pdf"
            aria-describedby={describedBy('attachment', attachmentHintId)}
            aria-invalid={Boolean(fieldErrors.attachment)}
            id={`${formId}-attachment`}
            name="attachment"
            type="file"
          />
          <p className="form-hint" id={attachmentHintId}>
            PDF only, 8 MB or smaller. The file stays private with the board.
          </p>
          <FieldError id={errorId('attachment')} message={fieldErrors.attachment} />
        </div>
      </div>

      <p className="form-disclaimer" id={disclaimerId}>
        {DISCLAIMER}
      </p>

      <TurnstileField resetSignal={state.status} />

      <Button busy={pending} disabled={pending} type="submit">
        {pending ? 'Sending…' : 'Send request'}
      </Button>
    </form>
  )
}
