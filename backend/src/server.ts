import axios from "axios";
import { AsyncResolver, CamelCaseKeyMapper, DotEnvLoader } from "confres";
import cors from "cors";
import path from "path";
import debug from "debug";
import express from "express";
import { createClient } from "redis";

// Local imports below
import { asyncWrap } from "./async-wrap";
import { internalIpV4 } from "./internal-ip";
import { generalErrorHandler } from "./general-error-handler";
import { getRedisData } from "./get-redis-data";
import { setRedisData } from "./set-redis-data";
import { clamp } from "./clamp";
import type { MeteorApiType } from "./types";

type ConfigVars = {
	meteoriteUrl: string;
	port: string;
	redisUrl: string;
	redisOpts: { url: string };
};

process.on("error", (err) => {
	console.log("PROCESS ON", { err });
});

const redisUsername = "";
const redisHostname = "192.168.1.16";
// const redisHostname = "localhost";
const redisPort = 16379;

const redisUrl = `redis://${redisHostname}:${redisPort}?ConnectTimeout=5000&IdleTimeOutSecs=180`;
// redis://localhost:6379?ConnectTimeout=5000&IdleTimeOutSecs=180

export const redisClient = createClient({
	// socket: { host: redisHostname, port: redisPort },
	url: redisUrl,
});

redisClient
	.on("connect", () => {
		console.log(`Connected to redis`);
		debug("Redis connect");
	})
	.on("ready", () => {
		debug("Redis ready");
	})
	.on("error", (e: unknown) => {
		console.log(`Redis error ${e}`);
		debug(`Redis error ${e}`);
	})
	.on("close", () => {
		debug("Redis close");
	})
	.on("reconnecting", () => {
		debug("Redis reconnecting");
	})
	.on("end", () => {
		debug("Redis end");
	});

async function main() {
	// Create a key mapper to grab env variables.
	// Currently prefixed by nothing.
	const keyMapper = new CamelCaseKeyMapper({ prefix: "" });

	// Create a resolver to fetch our env variables from file.
	const resolver = new AsyncResolver<ConfigVars>([
		new DotEnvLoader(keyMapper, ".env"),
	]);

	//
	const [configData, configErr] = await asyncWrap(() => resolver.resolve());

	// Guard against bad / unsuccessful config values
	if (configData === null) throw new Error("Config data is null!");
	if (configErr) generalErrorHandler(configErr);

	try {
		await redisClient.connect();
		console.log("Awaiting Redis Connection");
	} catch (redisErr) {
		console.error("UNKNOWN REDIS ERROR", redisErr);
	}

	// Add redis events in case we want to log this later

	// Close the connection when there is an interrupt sent from keyboard
	process.on("SIGINT", () => {
		redisClient.quit();
		console.log("redis client quit");
	});

	const server = express();

	// Set server middleware
	server.use(cors());
	server.use(express.json());

	// Add a default route for quick dev manual testing
	server.get("/", (req, res) => {
		res.sendFile(path.join(__dirname, "/index.html"));
	});

	server.get("/api/jsonData", getRedisData, async (req, res) => {
		// Coerce string | string[] | QueryString.ParsedQs |
		// QueryString.ParsedQs[] to string instead
		if (typeof req.query.$offset !== "string") return;

		// Clamp the limit value;
		// Setting num to default 20 is asinine
		// but the max limit will probably be set
		// by server config in the future, so I'll leave it
		const realLimit = clamp({
			num: Number(req.query.$limit) || 20,
			min: 0,
			max: 20,
		});

		const apiUri = `${configData.meteoriteUrl}?$offset=${req.query.$offset}&$limit=${realLimit}`;

		const [nasaData, nasaDataError] = await asyncWrap(() =>
			axios.get<MeteorApiType>(apiUri),
		);

		// Catch any errors here and send them to the client
		if (nasaDataError) {
			console.error(nasaDataError);
			res.status(400).send(nasaDataError);
		}

		// Set new values in Redis
		// Respond to the client
		if (nasaData) {
			setRedisData(req.query.$offset, nasaData.data, redisClient);

			res.status(200).send(nasaData.data);
		}
	});

	server.listen(configData.port, async () => {
		const ip = await internalIpV4();
		console.log(`
    Local: http://localhost:${configData.port}
    LAN: http://${ip}:${configData.port}`);
	});
}

main().catch((err) => {
	console.error(err);
});
