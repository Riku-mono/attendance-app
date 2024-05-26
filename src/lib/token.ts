// 入力値に対して、トークンを生成し、トークンをキーとして、値をキャッシュし、トークンを返す

import tokenCache from '@/lib/cache'

export async function createToken(): Promise<string> {
  const token = Math.random().toString(36).substring(2)
  return token
}

export async function getValue(token: string): Promise<string> {
  return tokenCache.get(token) || ''
}

export async function setToken(token: string, activityId: string): Promise<boolean> {
  return tokenCache.set(token, activityId, 30)
}

export async function getAllTokens(): Promise<string[]> {
  return tokenCache.keys()
}

export async function allCacheDrop(): Promise<void> {
  tokenCache.flushAll()
}

export async function checkToken(token: string): Promise<boolean> {
  return tokenCache.has(token)
}
