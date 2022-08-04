import { createClient } from "redis";
import { asyncWrap } from "../async-wrap";
import { buildMset } from "./build-mset";
import { cleanMeteorData } from "./clean-meteor-data";
import meteorDataJson from "./tmp/meteor-data/meteorData.json";

// Adapted from: https://stackoverflow.com/a/59832093

export async function seedMeteorData() {
	const limit = 20;
	const meteorData = cleanMeteorData(meteorDataJson);
	// const meteorData = dataCleaned.slice(0, 3);
	// const largerSeed = dataCleaned.slice(0, limit * 6);

	const redisHostname = "192.168.1.16";
	const redisPort = 16379;
	const redisUrl = `redis://${redisHostname}:${redisPort}?ConnectTimeout=5000&IdleTimeOutSecs=180`;

	const redisClient = createClient({
		url: redisUrl,
	});

	redisClient.on("error", (err) => console.log("Redis Client Error", err));
	redisClient.on("connect", (err) => console.log("Redis Client Connected!"));

	const [, connectError] = await asyncWrap(() => redisClient.connect());
	const [flush, flushError] = await asyncWrap(() => redisClient.flushDb());

	handleError(connectError);
	handleError(flushError);
	if (flush !== "OK") {
		handleError("Oh no our DB flush failed. Error unknown");
	}

	if (typeof flushError === "string") {
		throw new Error(flushError);
	}

	if (flushError instanceof Error) {
		throw flushError;
	}

	// const data = meteorData.slice(0, 3);
	const keys = [];
	const preppedData: string[] = [];

	// Use name for keying to aid search
	// from frontend
	for (const meteor of meteorData) {
		keys.push(meteor.name.toLowerCase());
	}

	// More efficient?
	for (let index = 0; index < meteorData.length; index++) {
		preppedData.push(keys[index]);
		preppedData.push(JSON.stringify(meteorData[index]));
	}

	const pageData = buildMset({ data: meteorData, limit });

	const [nameKeyInsert, nameKeyInsertErr] = await asyncWrap(() =>
		redisClient.mSet(preppedData),
	);

	const [pageInsert, pageInsertErr] = await asyncWrap(() =>
		redisClient.mSet(pageData),
	);

	console.log({ pageInsert, nameKeyInsert });

	redisClient.quit();
}

function handleError(err: unknown | null) {
	if (err === null) {
		return;
	}
	if (typeof err === "string") {
		throw new Error(err);
	}

	if (err instanceof Error) {
		throw err;
	}
}
