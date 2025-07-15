import { Search } from '@/pages/search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Search />
  )
}
