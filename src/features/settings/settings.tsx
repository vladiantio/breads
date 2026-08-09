import { ThemePresetSelect } from "./theme-preset-select"
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
import { useTheme } from "@/theme/theme-context"
import { presets } from "@/utils/theme-presets"
import { Moon, Sun, SunMoon } from "lucide-react"
import { GoBackButton } from "@/components/go-back-button"
import { useTranslation } from "react-i18next"
import { locales } from "@/i18n/languages"
import { changeLocale } from "@/i18n/i18n"

export function Settings() {
  const { theme, themeSettings, setTheme, setThemeSettings } = useTheme()
  const { t, i18n } = useTranslation()

  const handlePresetChange = (preset: string) => {
    setThemeSettings({
      theme: {
        preset,
        styles: presets[preset],
      }
    })
  }

  const themeOptions = [
    { label: t("settings.theme.system"), value: 'system', icon: SunMoon },
    { label: t("settings.theme.light"), value: 'light', icon: Sun },
    { label: t("settings.theme.dark"), value: 'dark', icon: Moon },
  ]

  return (
    <>
      <div className="sticky top-0 z-[1] bg-background px-4 h-16 flex items-center justify-between gap-x-4">
        <GoBackButton className="-ml-1" />
        <div className="font-bold flex-1">
          {t("nav.settings")}
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="mb-1">{t("settings.colorMode")}</p>
          <RadioGroup
            className="grid grid-cols-3 gap-2"
            value={theme}
            onValueChange={setTheme}
          >
            {themeOptions.map((option) => (
              <label
                key={option.value}
                className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
              >
                <RadioGroupItem
                  id={option.value}
                  value={option.value}
                  className="sr-only after:absolute after:inset-0"
                />
                <p className="text-foreground text-sm leading-none font-medium inline-flex items-center gap-x-2">
                  <option.icon className="inline-block size-4" />
                  {option.label}
                </p>
              </label>
            ))}
          </RadioGroup>
        </div>
        <div>
          <p className="mb-1">{t("settings.themePreset")}</p>
          <ThemePresetSelect
            presets={presets}
            currentPreset={themeSettings?.theme?.preset}
            onPresetChange={handlePresetChange}
          />
        </div>
        <div>
          <p className="mb-1">{t("settings.language")}</p>
          <RadioGroup
            className="grid grid-cols-2 gap-2"
            value={i18n.language}
            onValueChange={(value) => void changeLocale(value as keyof typeof locales)}
          >
            {Object.entries(locales).map(([value, label]) => (
              <label
                key={value}
                className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer items-center justify-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
              >
                <RadioGroupItem
                  id={value}
                  value={value}
                  className="sr-only after:absolute after:inset-0"
                />
                <p className="text-foreground text-sm leading-none font-medium">
                  {label}
                </p>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  )
}
