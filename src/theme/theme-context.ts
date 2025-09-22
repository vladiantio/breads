import { createContext, useContext } from "react"
import { Theme, ThemeSettings } from "./theme-types"

type ThemeProviderState = {
  theme: Theme
  themeSettings: ThemeSettings
  setTheme: (theme: Theme) => void
  setThemeSettings: (themeSettings: ThemeSettings) => void
}

export const initialThemeSettings: ThemeSettings = {
  theme: {
    preset: null,
    styles: null
  }
}

const initialState: ThemeProviderState = {
  theme: "system",
  themeSettings: initialThemeSettings,
  setTheme: () => null,
  setThemeSettings: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
