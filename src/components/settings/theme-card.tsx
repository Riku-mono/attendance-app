'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function SettingThemeCard() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  function onChange(values: { theme: string }) {
    try {
      setTheme(values.theme || 'system')
      toast.success('Theme saved')
    } catch (error) {
      toast.error('Failed to save theme')
      console.error(error)
    }
  }

  return (
    <Card x-chunk="settings-01-chunk-2">
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Choose how App looks to you. Select a single theme, or sync with your system and
          automatically switch between day and night themes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value: string) => onChange({ theme: value })} defaultValue={theme}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Theme</SelectLabel>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
