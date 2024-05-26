import { createToken, setToken } from '@/lib/token'

export async function POST(req: Request): Promise<Response> {
  const { activityId } = await req.json()
  const token = await createToken()
  await setToken(token, activityId)
  return new Response(JSON.stringify({ token }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
