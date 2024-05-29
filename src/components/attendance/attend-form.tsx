'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { attendActivity } from './action'
import { toast } from 'sonner'

import { Form, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const AttendActivitySchema = z.object({
  userId: z.string(),
  activityId: z.string(),
})

export type userAttendProps = {
  userId: string
  activityId: string
}

export function AttendForm({ userAttendProps }: { userAttendProps: userAttendProps }) {
  const [isPending, startTransition] = useTransition()
  const [userId, setUserId] = useState(userAttendProps.userId)
  const [activityId, setActivityId] = useState(userAttendProps.activityId)
  const router = useRouter()

  const form = useForm<z.infer<typeof AttendActivitySchema>>({
    resolver: zodResolver(AttendActivitySchema),
    defaultValues: {
      userId: userId,
      activityId: activityId,
    },
  })

  function onSubmit(values: z.infer<typeof AttendActivitySchema>) {
    startTransition(() => {
      const toastId = toast.loading('Attending...')
      attendActivity(values)
        .then(async (data) => {
          toast.dismiss(toastId)
          if (data.error) {
            toast.error(data.error)
          }
          if (data.success) {
            toast.success(data.success)
            router.refresh()
          }
        })
        .catch((error) => {
          toast.dismiss(toastId)
          toast.error(error.message)
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <Input disabled={isPending} className="sr-only" {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activityId"
          render={({ field }) => (
            <FormItem>
              <Input disabled={isPending} className="sr-only" {...field} />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Attend
        </Button>
      </form>
    </Form>
  )
}
