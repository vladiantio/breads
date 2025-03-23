import { Input } from '@/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Input placeholder="Search..." />
    </>
  )
}
