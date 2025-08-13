import { Home } from '@/features/feed/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: Index,
})

function Index() {
  return (
    <Home />
  )
}
