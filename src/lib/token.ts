// 入力値に対して、トークンを生成し、トークンをキーとして、値をキャッシュし、トークンを返す

import cacheService from '@/lib/cache'

export async function createToken(): Promise<string> {
  const token = Math.random().toString(36).substring(2)
  return token
}

export async function getValue(token: string): Promise<string> {
  return cacheService.get(token) || ''
}

export async function setToken(token: string, activityId: string): Promise<boolean> {
  return cacheService.set(token, activityId, 35)
}

export async function getAllTokens(): Promise<string[]> {
  return cacheService.getKeys()
}

export async function checkToken(token: string): Promise<boolean> {
  return cacheService.has(token)
}
