import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function SettingsGeneralPage() {
  return (
    <>
      <Card x-chunk="settings-01-chunk-1">
        <CardHeader>
          <CardTitle>Name</CardTitle>
          <CardDescription>
            Your name is used to identify you in the application and in email notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-2">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <Card x-chunk="settings-01-chunk-2">
        <CardHeader>
          <CardTitle>Campus</CardTitle>
          <CardDescription>
            Your campus is used to identify your location in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Campus</SelectLabel>
                  <SelectItem value="fukakusa">
                    Fukakusa<span className="h-2 w-2 bg-green-700"></span>
                  </SelectItem>
                  <SelectItem value="seta">Seta</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </>
  )
}
