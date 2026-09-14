import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { getPageContent } from '@/lib/cms'

export const metadata = {
  title: 'Board members',
}

export default async function BoardMembersPage() {
  const content = await getPageContent()

  return (
    <Container as="section" className="page-shell" width="narrow">
      <SectionHeading
        lede={content?.board?.intro}
        title={content?.board?.heading || 'Board members'}
        titleAs="h1"
      />
      <p>{content?.board?.emptyMessage}</p>
    </Container>
  )
}
