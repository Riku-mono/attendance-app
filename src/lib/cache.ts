import NodeCache from 'node-cache'

class CacheService {
  private static instance: NodeCache

  constructor() {
    if (typeof CacheService.instance === 'undefined') {
      CacheService.instance = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 30 })
    }
  }

  public set(key: string, value: any, ttl: number): boolean {
    return CacheService.instance.set(key, value, ttl)
  }

  public get(key: string): string | undefined {
    const value = CacheService.instance.get(key)
    if (typeof value === 'undefined') {
      return ''
    }
    return value as string
  }

  public getKeys(): string[] {
    return CacheService.instance.keys()
  }

  public has(key: string): boolean {
    return CacheService.instance.has(key)
  }
}

const cacheService = new CacheService()
export default cacheService
