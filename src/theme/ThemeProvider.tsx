import { createContext, useContext, useEffect, useState } from "react"

import type { ThemeSettings, ThemeStyles } from '@/types/theme'

import { COMMON_STYLES, defaultThemeState } from '@/config/theme'
import { colorFormatter } from "@/utils/color-converter"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  storageSettingsKey?: string
}

type ThemeProviderState = {
  theme: Theme
  themeSettings: ThemeSettings
  setTheme: (theme: Theme) => void
  setThemeSettings: (themeSettings: ThemeSettings) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  themeSettings: {
    theme: {
      preset: null,
      styles: null
    }
  },
  setTheme: () => null,
  setThemeSettings: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const applyThemeStyles = (root: HTMLElement, themeStyles: ThemeStyles) => {
  Object.entries(themeStyles.light)
    .filter(([key, value]) => COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number]) && typeof value === 'string')
    .forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

  Object.entries(themeStyles.light)
    .filter(([key, value]) => !COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number]) && typeof value === 'string')
    .forEach(([key, value]) => {
      root.style.setProperty(`--${key}--light`, colorFormatter(value, 'oklch'))
    })

  Object.entries(themeStyles.dark)
    .filter(([key, value]) => !COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number]) && typeof value === 'string')
    .forEach(([key, value]) => {
      root.style.setProperty(`--${key}--dark`, colorFormatter(value, 'oklch'))
    })
}

const initialThemeSettings: ThemeSettings = {
  theme: {
    preset: null,
    styles: null
  }
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  storageSettingsKey = "theme-settings",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(
    () => (typeof localStorage.getItem(storageSettingsKey) === 'string'
      ? JSON.parse(localStorage.getItem(storageSettingsKey) as string) as ThemeSettings
      : initialThemeSettings)
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement

    if (themeSettings.theme.styles) {
      const styles = {
        light: {
          ...defaultThemeState.light,
          ...themeSettings.theme.styles.light,
        },
        dark: {
          ...defaultThemeState.dark,
          ...themeSettings.theme.styles.dark,
        }
      }
      applyThemeStyles(root, styles)
    } else {
      root.removeAttribute('style')
    }
  }, [themeSettings])

  const value = {
    theme,
    themeSettings,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    setThemeSettings: (themeSettings: ThemeSettings) => {
      localStorage.setItem(storageSettingsKey, JSON.stringify(themeSettings))
      setThemeSettings(themeSettings)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

export { ThemeProvider, useTheme }
