import { User } from 'next-auth'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UserProfileCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>GitHub</CardDescription>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Image
            className="h-12 w-12 rounded-full"
            width={48}
            height={48}
            src={user.image || '/images/default-avatar.png'}
            alt={user.name || 'User profile picture'}
          />
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <Badge variant="outline">{user.role}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
