import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { getPageContent } from '@/lib/cms'

export const metadata = {
  title: 'Events',
}

export default async function EventsPage() {
  const content = await getPageContent()

  return (
    <Container as="section" className="page-shell" width="narrow">
      <SectionHeading
        lede={content?.events?.intro}
        title={content?.events?.heading || 'Events'}
        titleAs="h1"
      />
      <p>{content?.events?.emptyUpcomingMessage}</p>
    </Container>
  )
}
