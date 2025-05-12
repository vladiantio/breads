// React Imports
import { useMemo } from 'react'

// Type Imports
import type { ThemePreset, ThemeStyleProps } from '@/types/theme'

// Component Imports
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Badge } from '../ui/badge'

// Config Imports
import { defaultThemeState } from '@/config/theme'

type ThemePresetSelectProps = {
  presets: Record<string, ThemePreset>
  currentPreset: string | null
  onPresetChange: (preset: string) => void
}

const ThemePresetSelect = ({ presets, currentPreset, onPresetChange }: ThemePresetSelectProps) => {
  const presetNames = useMemo(() => {
    // First get all preset names
    const allPresets = Object.keys(presets)

    // Separate presets with badges and those without
    const presetsWithBadges = allPresets.filter(name => presets[name]?.meta?.badge)
    const presetsWithoutBadges = allPresets.filter(name => !presets[name]?.meta?.badge)

    // Sort each group alphabetically
    presetsWithBadges.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    presetsWithoutBadges.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

    // Always keep 'default' as the first item in the list without badges
    return ['default', ...presetsWithBadges, ...presetsWithoutBadges.filter(name => name !== 'default')]
  }, [presets])

  const value = presetNames?.find(name => name === currentPreset)

  // Helper function to get theme color
  const getThemeColor = (themeName: string, color: keyof ThemeStyleProps) => {
    // If it's default theme, use the first preset as default
    const theme = themeName === 'default' ? defaultThemeState : presets[themeName]

    return theme?.light?.[color] || theme?.dark?.[color] || '#000000'
  }

  // Helper function to get badge for a theme
  const getThemeBadge = (themeName: string) => {
    if (themeName === 'default') return null

    return presets[themeName]?.meta?.badge || null
  }

  return (
    <Select value={value || ''} onValueChange={onPresetChange}>
      <SelectTrigger className='h-12 w-full cursor-pointer'>
        <SelectValue placeholder='Chose Theme' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pre Built Themes</SelectLabel>
          {presetNames.map(name => {
            const badge = getThemeBadge(name)

            return (
              <SelectItem key={name} value={name} className='flex items-center gap-3'>
                {/* Theme Color Grid Icon */}
                <div className='flex items-center'>
                  <div className='bg-background relative size-[26px] rounded border p-1'>
                    <div className='grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]'>
                      <div className='rounded-[2px]' style={{ backgroundColor: getThemeColor(name, 'primary') }} />
                      <div
                        className='rounded-[2px]'
                        style={{ backgroundColor: getThemeColor(name, 'destructive') }}
                      />
                      <div className='rounded-[2px]' style={{ backgroundColor: getThemeColor(name, 'secondary') }} />
                      <div className='rounded-full' style={{ backgroundColor: getThemeColor(name, 'accent') }} />
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span>{name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</span>
                  {badge && (
                    <Badge variant='outline' className='border-primary bg-primary/10 text-primary border'>
                      {badge}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { ThemePresetSelect }
