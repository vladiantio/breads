import { createContext, useContext } from "react"

type AppSettingsProviderState = {
  hideMedia: boolean
  setHideMedia: (hideMedia: boolean) => void
}

export const initialAppSettings = {
  hideMedia: false,
}

const initialState: AppSettingsProviderState = {
  hideMedia: initialAppSettings.hideMedia,
  setHideMedia: () => null,
}

export const AppSettingsProviderContext =
  createContext<AppSettingsProviderState>(initialState)

export const useAppSettings = () => {
  const context = useContext(AppSettingsProviderContext)

  if (context === undefined)
    throw new Error("useAppSettings must be used within an AppSettingsProvider")

  return context
}
