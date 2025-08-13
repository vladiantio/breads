import { Search } from '@/features/search/search'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Search />
  )
}
