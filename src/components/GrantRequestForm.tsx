'use client'

import { useActionState, useId } from 'react'

import { Button } from '@/components/Button'
import { submitGrantRequest } from '@/app/(frontend)/actions/submitGrant'
import type { GrantField } from '@/lib/grant'
import { initialGrantState } from '@/lib/grantState'

type GrantRequestFormProps = {
  heading: string
  intro?: string | null
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

export function GrantRequestForm({ heading, intro }: GrantRequestFormProps) {
  const [state, action, pending] = useActionState(submitGrantRequest, initialGrantState)
  const formId = useId()
  const fieldErrors = state.fieldErrors ?? {}
  const values = state.values ?? initialGrantState.values

  const errorId = (field: GrantField) => `${formId}-${field}-error`
  const describedBy = (field: GrantField) => (fieldErrors[field] ? errorId(field) : undefined)

  if (state.status === 'success') {
    return (
      <div className="contact-success" role="status">
        <h2 id="grant-request-heading">{heading}</h2>
        <p>
          Thank you. Your request was saved for the Friends of Recreation board. A volunteer will
          contact you if more information is needed.
        </p>
        <p className="body-note">{DISCLAIMER}</p>
      </div>
    )
  }

  return (
    <form
      action={action}
      aria-describedby={state.formError ? `${formId}-form-error` : undefined}
      className="grant-form"
      noValidate
    >
      <header className="grant-form-intro">
        <h2 id="grant-request-heading">{heading}</h2>
        {intro ? <p>{intro}</p> : null}
      </header>

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
          <label htmlFor={`${formId}-organizationName`}>Organization or group name</label>
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
          <label htmlFor={`${formId}-grant-phone`}>
            Phone <span className="form-optional">(optional)</span>
          </label>
          <input
            aria-describedby={describedBy('phone')}
            aria-invalid={Boolean(fieldErrors.phone)}
            autoComplete="tel"
            defaultValue={values.phone}
            id={`${formId}-grant-phone`}
            name="phone"
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
          <label htmlFor={`${formId}-amountRequested`}>
            Amount requested <span className="form-optional">(optional)</span>
          </label>
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
          <label htmlFor={`${formId}-projectTitle`}>Project or program name</label>
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
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-request`}>Tell us about your request</label>
        <textarea
          aria-describedby={describedBy('request')}
          aria-invalid={Boolean(fieldErrors.request)}
          defaultValue={values.request}
          id={`${formId}-request`}
          name="request"
          required
          rows={6}
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
          defaultValue={values.recreationImpact}
          id={`${formId}-recreationImpact`}
          name="recreationImpact"
          rows={3}
        />
        <FieldError id={errorId('recreationImpact')} message={fieldErrors.recreationImpact} />
      </div>

      <div className="form-field">
        <label htmlFor={`${formId}-requestedTimeline`}>
          Requested funding date or project timeline{' '}
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

      <p className="form-disclaimer">{DISCLAIMER}</p>

      <Button busy={pending} disabled={pending} type="submit">
        {pending ? 'Sending…' : 'Send request'}
      </Button>
    </form>
  )
}
