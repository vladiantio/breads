import { useEffect, useState } from "react"

import {
  AppSettingsProviderContext,
  initialAppSettings,
} from "./app-settings-context"

type AppSettingsProviderProps = {
  children: React.ReactNode
  storageKey?: string
}

export function AppSettingsProvider({
  children,
  storageKey = "app-settings",
}: AppSettingsProviderProps) {
  const [hideMedia, setHideMediaState] = useState<boolean>(
    () =>
      (typeof localStorage.getItem(storageKey) === "string"
        ? JSON.parse(localStorage.getItem(storageKey) as string).hideMedia
        : initialAppSettings.hideMedia) ?? initialAppSettings.hideMedia
  )

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue)
          if (typeof parsed.hideMedia === "boolean") {
            setHideMediaState(parsed.hideMedia)
          }
        } catch {
          setHideMediaState(initialAppSettings.hideMedia)
          localStorage.setItem(storageKey, JSON.stringify(initialAppSettings))
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [storageKey])

  const value = {
    hideMedia,
    setHideMedia: (hideMedia: boolean) => {
      localStorage.setItem(storageKey, JSON.stringify({ hideMedia }))
      setHideMediaState(hideMedia)
    },
  }

  return (
    <AppSettingsProviderContext value={value}>
      {children}
    </AppSettingsProviderContext>
  )
}
