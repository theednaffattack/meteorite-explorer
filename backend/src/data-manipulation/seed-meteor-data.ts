import { createClient } from "redis";
import { asyncWrap } from "../async-wrap";
import meteorData from "./tmp/meteor-data/meteorData.json";

export async function seedMeteorData() {
	const redisHostname = "192.168.1.16";
	const redisPort = 16379;
	const redisUrl = `redis://${redisHostname}:${redisPort}?ConnectTimeout=5000&IdleTimeOutSecs=180`;

	const redisClient = createClient({
		url: redisUrl,
	});

	redisClient.on("error", (err) => console.log("Redis Client Error", err));
	const [, connectError] = await asyncWrap(() => redisClient.connect());
	const [flush, flushError] = await asyncWrap(() => redisClient.flushDb());
	const data = meteorData.slice(0, 3);
	const stringifiedData = JSON.stringify(data);
	const keys = [];
	const values = [];
	const arr: string[] = [];

	// Use name for keying to aid search
	// from frontend
	for (const meteor of meteorData) {
		keys.push(meteor.name.toLowerCase());
	}

	// // Push the whole record as a value
	// for (const meteor of meteorData) {
	// 	values.push(JSON.stringify(meteor));
	// }

	// More efficient?
	for (let index = 0; index < meteorData.length; index++) {
		arr.push(keys[index]);
		arr.push(JSON.stringify(meteorData[index]));
	}

	const [bulkInsert, bulkInsertError] = await asyncWrap(() =>
		redisClient.mSet(arr),
	);

	console.log("SEED METEOR DATA", {
		data,
		length: data.length,
		bulkInsert,
		bulkInsertError,
	});
}
