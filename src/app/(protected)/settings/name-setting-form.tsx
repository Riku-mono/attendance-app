'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState, useTransition } from 'react'
import { nameSetting } from './action'

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
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const NameSettingSchema = z.object({
  firstName: z.string().min(1).max(32, 'First name must be between 2 and 32 characters'),
  lastName: z.string().min(1).max(32, 'Last name must be between 2 and 32 characters'),
})

export type userName = {
  firstName: string
  lastName: string
}

export function NameSettingForm({ userName }: { userName: userName }) {
  const [isPending, startTransition] = useTransition()
  const [firstName, setFirstName] = useState(userName.firstName)
  const [lastName, setLastName] = useState(userName.lastName)
  const [hasChanged, setHasChanged] = useState(false)

  const form = useForm<z.infer<typeof NameSettingSchema>>({
    resolver: zodResolver(NameSettingSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
    },
  })

  function onSubmit(values: z.infer<typeof NameSettingSchema>) {
    startTransition(() => {
      const toastId = toast.loading('Saving...')
      nameSetting(values)
        .then(async (data) => {
          toast.dismiss(toastId)
          if (data.error) {
            toast.error(data.error)
          }
          if (data.success) {
            toast.success(data.success)
            setFirstName(values.firstName)
            setLastName(values.lastName)
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

  let formValues = form.watch()
  useEffect(() => {
    if (formValues.firstName !== firstName || formValues.lastName !== lastName) {
      setHasChanged(true)
    } else {
      setHasChanged(false)
    }
  }, [formValues, firstName, lastName])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2" onReset={onreset}>
        <Card>
          <CardHeader>
            <CardTitle>Name</CardTitle>
            <CardDescription>Your name is used to identify you in the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="gap-2 border-t px-6 py-4">
            {hasChanged && (
              <Button type="reset" disabled={isPending} variant="outline">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending || !hasChanged}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
