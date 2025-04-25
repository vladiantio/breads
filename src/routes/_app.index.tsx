import { Home } from '@/pages/Home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: Index,
})

function Index() {
  return (
    <Home />
  )
}
