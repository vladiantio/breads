import { useEffect, useState } from "react"

import { COMMON_STYLES, defaultThemeState } from "@/config/theme"
import { colorFormatter } from "@/utils/color-converter"
import { Theme, ThemeSettings, ThemeStyles } from "./theme-types"
import { initialThemeSettings, ThemeProviderContext } from "./theme-context"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  storageSettingsKey?: string
}

const applyThemeStyles = (root: HTMLElement, themeStyles: ThemeStyles) => {
  Object.entries(themeStyles.light)
    .filter(([key, value]) => COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number]) && typeof value === "string")
    .forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

  Object.entries(themeStyles.light)
    .filter(([key, value]) => !COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number]) && typeof value === "string")
    .forEach(([key, value]) => {
      root.style.setProperty(`--${key}--light`, colorFormatter(value, "oklch"))
    })

  Object.entries(themeStyles.dark)
    .filter(([key, value]) => !COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number]) && typeof value === "string")
    .forEach(([key, value]) => {
      root.style.setProperty(`--${key}--dark`, colorFormatter(value, "oklch"))
    })
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  storageSettingsKey = "theme-settings",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(
    () => (typeof localStorage.getItem(storageSettingsKey) === "string"
      ? JSON.parse(localStorage.getItem(storageSettingsKey) as string)
      : initialThemeSettings)
  )

  useEffect(() => {
    const matchPrefersDark = window.matchMedia("(prefers-color-scheme: dark)")

    const updateTheme = () => {
      const isDark = theme == "system" ? matchPrefersDark.matches : theme == "dark"
      document.documentElement.classList.toggle("dark", isDark)
    }

    updateTheme()
    matchPrefersDark.addEventListener("change", updateTheme)

    return () => {
      matchPrefersDark.removeEventListener("change", updateTheme)
    }
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
      root.removeAttribute("style")
    }
  }, [themeSettings])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Sync theme from storage
      if (event.key === storageKey && event.newValue) {
        const newTheme = event.newValue as Theme;
        if (["light", "dark", "system"].includes(newTheme)) {
          setTheme(newTheme);
        } else {
          console.warn(`Invalid theme value received from storage: ${event.newValue}`);
          setTheme(defaultTheme);
          localStorage.setItem(storageKey, defaultTheme);
        }
      }
      // Sync theme settings from storage
      if (event.key === storageSettingsKey && event.newValue) {
        if (typeof event.newValue === "string") {
          setThemeSettings(JSON.parse(event.newValue));
        } else {
          console.warn(`Invalid theme settings value received from storage: ${event.newValue}`);
          setThemeSettings(initialThemeSettings);
          localStorage.setItem(storageSettingsKey, JSON.stringify(initialThemeSettings));
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [storageKey, storageSettingsKey, defaultTheme])

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
    <ThemeProviderContext value={value}>
      {children}
    </ThemeProviderContext>
  )
}
