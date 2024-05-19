import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ModeSelect } from '@/components/theme-toggle-btn'

export default async function SettingsDisplayPage() {
  return (
    <>
      <Card x-chunk="settings-01-chunk-2">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose how App looks to you. Select a single theme, or sync with your system and
            automatically switch between day and night themes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModeSelect />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </>
  )
}
