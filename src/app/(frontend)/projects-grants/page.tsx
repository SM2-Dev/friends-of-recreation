import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { getPageContent } from '@/lib/cms'

export const metadata = {
  title: 'Projects and grants',
}

export default async function ProjectsGrantsPage() {
  const content = await getPageContent()

  return (
    <Container as="section" className="page-shell" width="wide">
      <SectionHeading
        lede={content?.projects?.intro}
        title={content?.projects?.heading || 'Projects and grants'}
        titleAs="h1"
      />
      <p>{content?.projects?.emptyMessage}</p>
      <SectionHeading
        className="grant-heading"
        lede={content?.projects?.grantIntro}
        title={content?.projects?.grantHeading || 'Request grant support'}
      />
    </Container>
  )
}
