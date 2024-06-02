'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { DateTimePicker } from '@/components/datetimepicker'
import { Button } from '@/components/ui/button'
import { Campus } from '@prisma/client'
import MultipleSelector from '@/components/ui/multi-select'
import { createActivity } from './action'

enum ActivityTypes {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
}

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
})

export const ActivityCreateSchema = z.object({
  title: z.string().min(3).max(30, 'Title must be between 3 and 30 characters'),
  description: z.string().min(3).max(100, 'Description must be between 3 and 100 characters'),
  isNormalActivity: z.boolean().default(false),
  targets: z.array(optionSchema).min(1),
  activityType: z.nativeEnum(ActivityTypes),
  place: z.string().min(1).max(20, 'Place must select or create a place'),
  startDateTime: z
    .date()
    .nullable()
    .refine((date) => date && date > new Date(), {
      message: 'Start date time must be in the future',
    }),
  endDateTime: z
    .date()
    .nullable()
    .refine((date) => date && date > new Date(), {
      message: 'End date time must be in the future',
    }),
})

export function ActivityCreateForm({ isAdmin, campus }: { isAdmin: boolean; campus: Campus[] }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const OPTIONS = campus.map((campus) => ({
    label: campus.name,
    value: campus.id.toString(),
  }))

  const form = useForm<z.infer<typeof ActivityCreateSchema>>({
    resolver: zodResolver(ActivityCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      isNormalActivity: false,
      activityType: ActivityTypes.OFFLINE,
      place: '',
      startDateTime: null,
      endDateTime: null,
    },
  })

  function onSubmit(values: z.infer<typeof ActivityCreateSchema>) {
    startTransition(() => {
      const toastId = toast.loading('Creating activity...')
      createActivity(values)
        .then(async (data) => {
          toast.dismiss(toastId)
          if (data.error) {
            toast.error(data.error)
            setError(data.error)
          }
          if (data.success) {
            toast.success(data.success)
            setSuccess(data.success)
            router.push(`/activity/${data.id}`)
          }
        })
        .catch((error) => {
          toast.dismiss(toastId)
          toast.error('An error occurred while creating the activity.')
          setError('An error occurred while creating the activity.')
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter the title of the activity"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The title of the activity should be descriptive and concise.{' '}
                  {'(Max 30 characters)'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the description of the activity"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the activity in detail. What is the purpose of the activity? What will
                  {'(Max 100 characters)'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        {isAdmin && (
          <FormField
            control={form.control}
            name="isNormalActivity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Normal Activity | Admin Only</FormLabel>
                <FormControl className="flex items-center">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormDescription>
                  Check this box if the activity is a normal activity. The information will be made
                  available to applicable targets.
                  {'(Max 100 characters)'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="targets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Targets</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={OPTIONS}
                  placeholder="Select the targets of the activity"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of the activity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ActivityTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the type of the activity.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Place</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Enter the place of the activity"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  aria-label="Select a start date and time"
                  granularity="second"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Select the start date time of the activity.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  aria-label="Select a end date and time"
                  granularity="second"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Select the end date time of the activity.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Create Activity
        </Button>
      </form>
    </Form>
  )
}
