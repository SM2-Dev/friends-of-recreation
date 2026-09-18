import type { Metadata } from 'next'

import { CmsAccessForm } from '@/components/CmsAccessForm'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'CMS access',
  robots: { index: false, follow: false },
}

export default function CmsAccessPage() {
  return (
    <Container as="section" className="page-shell" width="narrow">
      <CmsAccessForm />
    </Container>
  )
}
