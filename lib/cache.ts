// Small cache abstraction: uses Redis (ioredis) when REDIS_URL present, otherwise in-memory.
import type Redis from 'ioredis'

const globalAny: any = global

type CacheEntry = { value: any; ts: number }

if (!globalAny.__localCache) globalAny.__localCache = new Map<string, CacheEntry>()

let redisClient: Redis | null = null
try {
  if (process.env.REDIS_URL) {
    // lazy require to avoid errors when dependency isn't installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require('ioredis')
    redisClient = new IORedis(process.env.REDIS_URL)
    // attach to global so it's reused across invocations
    globalAny.__redisClient = redisClient
  }
} catch (e) {
  // ignore if ioredis not available
  redisClient = globalAny.__redisClient || null
}

export async function getCache(key: string): Promise<any | null> {
  if (redisClient) {
    try {
      const v = await redisClient.get(key)
      if (!v) return null
      return JSON.parse(v)
    } catch (e) {
      console.warn('redis get failed', e)
      return null
    }
  }

  const entry: CacheEntry | undefined = globalAny.__localCache.get(key)
  if (!entry) return null
  return entry.value
}

export async function setCache(key: string, value: any, ttlMs?: number): Promise<void> {
  if (redisClient) {
    try {
      const str = JSON.stringify(value)
      if (ttlMs) await redisClient.set(key, str, 'PX', ttlMs)
      else await redisClient.set(key, str)
      return
    } catch (e) {
      console.warn('redis set failed', e)
    }
  }

  globalAny.__localCache.set(key, { value, ts: Date.now() })
  return
}
