import { Timeline } from '@/components/feed/Timeline'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: Index,
})

function Index() {
  return <Timeline />
}
