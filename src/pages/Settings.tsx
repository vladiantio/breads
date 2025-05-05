import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/theme/ThemeProvider";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Moon, Sun, SunMoon } from "lucide-react";

const themeOptions = [
  { label: 'System', value: 'system', icon: SunMoon },
  { label: 'Light', value: 'light', icon: Sun },
  { label: 'Dark', value: 'dark', icon: Moon },
]

export function Settings() {
  const { history } = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="sticky top-0 z-[1] bg-background px-4 h-16 flex items-center justify-between gap-x-4">
        <Button
          variant="ghost"
          className="rounded-full !p-2 -ml-1"
          onClick={() => history.go(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="font-bold flex-1">
          Settings
        </div>
      </div>
      <div className="p-4">
        <p className="mb-1">Color mode</p>
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
    </>
  );
}
