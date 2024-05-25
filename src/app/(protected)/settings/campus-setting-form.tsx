'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { campusSetting } from './action'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { Button } from '@/components/ui/button'

type Campus = {
  id: number
  name: string
  color: string
}

export const CampusSettingSchema = z.object({
  campusId: z.string().min(1, 'Please select a campus'),
})

export function CampusSettingForm({
  defaultCampusId,
  campusList,
}: {
  defaultCampusId: number
  campusList: Campus[]
}) {
  const [isPending, startTransition] = useTransition()
  const { data: session, update } = useSession()
  const [campusId, setCampusId] = useState(defaultCampusId.toString())
  const [campus, setCampus] = useState(campusList)

  const [hasChanged, setHasChanged] = useState(false)

  const form = useForm<z.infer<typeof CampusSettingSchema>>({
    resolver: zodResolver(CampusSettingSchema),
    defaultValues: {
      campusId: campusId,
    },
  })

  function onSubmit(values: z.infer<typeof CampusSettingSchema>) {
    startTransition(() => {
      const toastId = toast.loading('Saving...')
      campusSetting(values)
        .then(async (data) => {
          toast.dismiss(toastId)
          if (data.error) {
            toast.error(data.error)
          }
          if (data.success) {
            toast.success(data.success)
            setCampusId(values.campusId)
            update({
              campusId: parseInt(values.campusId),
            })
            setHasChanged(false)
          }
        })
        .catch(() => {
          toast.dismiss(toastId)
          toast.error('An error occurred. Please try again.')
        })
    })
  }

  function onreset() {
    form.reset()
    setHasChanged(false)
  }

  let formValues = form.getValues()
  useEffect(() => {
    if (formValues.campusId !== campusId) {
      setHasChanged(true)
    } else {
      setHasChanged(false)
    }
  }, [formValues.campusId, campusId])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2" onReset={onreset}>
        <Card>
          <CardHeader>
            <CardTitle>Campus</CardTitle>
            <CardDescription>
              Your campus info is used to identify you in the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="campusId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campus</FormLabel>
                  <FormControl>
                    <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a campus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Campus</SelectLabel>
                          {campus.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()} className="capitalize">
                              {c.name}
                              <span
                                className="ml-1 inline-block h-2 w-2 rounded-full"
                                style={{ backgroundColor: c.color }}
                              ></span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="gap-2 border-t px-6 py-4">
            {hasChanged && (
              <Button type="reset" variant="outline">
                Reset
              </Button>
            )}
            <Button type="submit" disabled={!hasChanged}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
