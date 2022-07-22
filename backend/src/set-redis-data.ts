/**
 * Set a value in redis by passing a key and value.
 * @param key
 * @param value
 * */

export async function setRedisData(key: string, value: any, redisClient: any) {
	return await redisClient.set(key, JSON.stringify(value));
}
