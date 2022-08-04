import { createClient } from "redis";
import { asyncWrap } from "../async-wrap";
// import { redisClient } from "../server";

export async function flushMeteorRecords() {
	const redisHostname = "192.168.1.16";
	const redisPort = 16379;
	const redisUrl = `redis://${redisHostname}:${redisPort}?ConnectTimeout=5000&IdleTimeOutSecs=180`;
	// redis://localhost:6379?ConnectTimeout=5000&IdleTimeOutSecs=180

	const redisClient = createClient({
		url: redisUrl,
	});

	redisClient.on("error", (err) => console.log("Redis Client Error", err));
	// const [bulkInsert, bulkInsertError] = await asyncWrap(() => redisClient.mSet());
	const [, connectError] = await asyncWrap(() => redisClient.connect());
	const [data, error] = await asyncWrap(() => redisClient.flushDb());

	redisClient.quit();
}
