import Link from 'next/link'

import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'

export default function NotFound() {
  return (
    <Container as="section" className="page-shell" width="narrow">
      <SectionHeading title="Page not found" titleAs="h1" />
      <p>
        That page is not on the Friends of Recreation site. Use the navigation to return home, view
        events, or see projects and grants.
      </p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </Container>
  )
}
