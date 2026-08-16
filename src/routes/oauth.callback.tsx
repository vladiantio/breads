import { useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAtpStore } from '@/lib/atp/store'

export const Route = createFileRoute('/oauth/callback')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const finalizeAuth = useAtpStore(s => s.finalizeAuth)
  // StrictMode double-invokes effects in dev; the code can only be exchanged once
  const finalized = useRef(false)

  useEffect(() => {
    if (finalized.current) return
    finalized.current = true

    // server redirects with params in hash, not search string
    const params = new URLSearchParams(location.hash.slice(1))

    // scrub params from URL to prevent replay
    history.replaceState(null, '', location.pathname + location.search)

    finalizeAuth(params)
      .then(() => navigate({ to: '/' }))
      .catch(() => navigate({ to: '/login' }))
  }, [finalizeAuth, navigate])

  return null
}
