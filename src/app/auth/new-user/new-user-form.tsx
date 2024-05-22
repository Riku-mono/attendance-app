'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { newUserSettings } from './action'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { Checkbox } from '@/components/ui/checkbox'

export const NewUserSettingsSchema = z.object({
  firstName: z.string().min(1).max(32, 'First name must be between 2 and 32 characters'),
  lastName: z.string().min(1).max(32, 'Last name must be between 2 and 32 characters'),
  campusId: z.string().min(1, 'Please select a campus'),
  term: z.boolean().refine((value) => value === true, 'Please agree to the terms of service'),
})

type Campus = {
  id: number
  name: string
  color: string
}

export function ProfileForm({ campus }: { campus: Campus[] }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { data: session, update } = useSession()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof NewUserSettingsSchema>>({
    resolver: zodResolver(NewUserSettingsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      campusId: '',
      term: false,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof NewUserSettingsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(() => {
      const toastId = toast.loading('Saving...')
      newUserSettings(values)
        .then(async (data) => {
          toast.dismiss(toastId)
          if (data.error) {
            toast.error(data.error)
            setError(data.error)
            update({
              profileInitialized: false,
              campusId: null,
            })
          }
          if (data.success) {
            toast.success(data.success)
            setSuccess(data.success)
            update({
              profileInitialized: true,
              campusId: parseInt(values.campusId),
            }).then(() => {
              router.push('/settings')
            })
          }
        })
        .catch(() => setError('Something went wrong. Please try again.'))
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormDescription>Enter your first name in your language.</FormDescription>
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
              <FormDescription>Enter your last name in your language.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="campusId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campus</FormLabel>
              <FormControl>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
              <FormDescription>Select the campus you are affiliated with.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms of Service</FormLabel>
              <FormControl>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    disabled={isPending}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      You agree to our{' '}
                      <Link href="/docs/term-of-service" className="text-primary underline">
                        Terms of Service
                      </Link>
                      <span> and </span>
                      <Link href="/docs/privacy-policy" className="text-primary underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
