import axios from "axios";
import { AsyncResolver, CamelCaseKeyMapper, DotEnvLoader } from "confres";
import cors from "cors";
import path from "path";
import debug from "debug";
import express from "express";
import { createClient } from "redis";
import { internalIpV4 } from "./internal-ip";

// Local imports below
import { asyncWrap } from "./async-wrap";
import { generalErrorHandler } from "./general-error-handler";
import { getRedisData } from "./get-redis-data";
import { setRedisData } from "./set-redis-data";

type ConfigVars = {
	meteoriteUrl: string;
	port: string;
	redisUrl: string;
	redisOpts: { url: string };
};

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

	const redisClient = createClient({ url: configData.redisUrl });

	// Add redis events in case we want to log this later
	redisClient
		.on("connect", () => {
			debug("Redis connect");
		})
		.on("ready", () => {
			debug("Redis ready");
		})
		.on("error", (e: unknown) => {
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

	const server = express();

	// Set server middleware
	server.use(cors());
	server.use(express.json());

	// Add a default route for quick dev manual testing
	server.get("/", (req, res) => {
		res.sendFile(path.join(__dirname, "/index.html"));
	});

	server.get(
		"/api/jsonData",
		(req, res, next) => getRedisData(req, res, next, redisClient),
		async (req, res) => {
			const { data: nasaData } = await axios.get(
				`${configData.meteoriteUrl}?offset=${req.query.page}&$limit=20`,
			);
			// ParsedQs can be string or string[] or undefined
			// so test if the variable is of type "string"
			if (nasaData && typeof req.query.page === "string") {
				setRedisData(req.query.page, nasaData, redisClient);
			}
		},
	);

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
