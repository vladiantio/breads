import { ThemePresetSelect } from "@/components/settings/theme-preset-select"
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
import { useTheme } from "@/theme/theme-provider"
import { presets } from "@/utils/theme-presets"
import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import { Moon, Sun, SunMoon } from "lucide-react"
import { GoBackButton } from "@/components/shared/go-back-button"

export function Settings() {
  const { theme, themeSettings, setTheme, setThemeSettings } = useTheme()

  const handlePresetChange = (preset: string) => {
    setThemeSettings({
      theme: {
        preset,
        styles: presets[preset],
      }
    })
  }

  const themeOptions = [
    { label: t`System`, value: 'system', icon: SunMoon },
    { label: t`Light`, value: 'light', icon: Sun },
    { label: t`Dark`, value: 'dark', icon: Moon },
  ]

  return (
    <>
      <div className="sticky top-0 z-[1] bg-background px-4 h-16 flex items-center justify-between gap-x-4">
        <GoBackButton className="-ml-1" />
        <div className="font-bold flex-1">
          <Trans>Settings</Trans>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="mb-1"><Trans>Color mode</Trans></p>
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
          <p className="mb-1"><Trans>Theme Preset</Trans></p>
          <ThemePresetSelect
            presets={presets}
            currentPreset={themeSettings?.theme?.preset}
            onPresetChange={handlePresetChange}
          />
        </div>
      </div>
    </>
  )
}
