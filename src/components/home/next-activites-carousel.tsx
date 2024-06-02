'use client'

import { useEffect, useState } from 'react'
import { MapPinIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { type CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type Activity = {
  id: string
  name: string
  place: string
  activityType: string
  startDateTime: Date
  endDateTime: Date
}

export default function NextActivitiesCarousel({ activities }: { activities: Activity[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  // activities = []

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Card>
      {activities.length > 0 && (
        <>
          <Carousel
            orientation="horizontal"
            setApi={setApi}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${activities.length}, 100%)`,
              }}
            >
              {activities.map((activity, index) => (
                <CarouselItem key={activity.id}>
                  <CardHeader className="pb-2">
                    <CardDescription>
                      {/* 一番初めの要素であれば、Next */}
                      {index === 0 && <span>Next</span>}
                      {/* それ以外であれば、Soon */}
                      {index > 0 && <span>Soon - {index}</span>}
                    </CardDescription>
                    <CardTitle className="flex items-center gap-2">
                      <span>{activity.name}</span>
                      <Badge variant="outline">{activity.activityType}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-1 text-sm font-medium text-muted-foreground">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{activity.place}</span>
                      <span>|</span>
                      <span>
                        {activity.startDateTime?.toLocaleDateString()}{' '}
                        {activity.startDateTime?.toLocaleTimeString()}
                      </span>
                      {(activity.startDateTime?.toLocaleDateString() !==
                        activity.endDateTime?.toLocaleDateString() && (
                        <>
                          <span>|</span>
                          <span>
                            {activity.endDateTime?.toLocaleDateString()}{' '}
                            {activity.endDateTime?.toLocaleTimeString()}
                          </span>
                        </>
                      )) || (
                        <>
                          <span>-</span>
                          <span>{activity.endDateTime?.toLocaleTimeString()}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="mb-3 flex justify-center gap-2">
            {activities.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`${
                  current === index + 1 ? 'bg-foreground text-white' : 'a bg-muted text-accent'
                } h-1 w-6 rounded-full transition-all`}
              />
            ))}
          </div>
        </>
      )}
      {activities.length === 0 && (
        <div className="flex h-full flex-col justify-center gap-4">
          {/* まだ、次の活動はありません */}
          <p className="text-center text-muted-foreground">No next activities found.</p>
        </div>
      )}
    </Card>
  )
}
