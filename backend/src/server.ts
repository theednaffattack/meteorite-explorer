import axios from "axios";
import { AsyncResolver, CamelCaseKeyMapper, DotEnvLoader } from "confres";
import cors from "cors";
import debug from "debug";
import express from "express";
import { createClient } from "redis";
import { internalIpV6, internalIpV4 } from "./internal-ip";

// Local imports below
import { asyncWrap } from "./async-wrap";
import { generalErrorHandler } from "./general-error-handler";
import { get } from "./get";
import { set } from "./set";

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

	if (configData === null) throw new Error("Config data is null!");

	if (configErr) generalErrorHandler(configErr);

	console.log("READY CONFIG FN", { data: configData, err: configErr });

	const redisClient = createClient({ url: configData.redisUrl });

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

	server.get(
		"api/jsonData",
		(req, res, next) => get(req, res, next, redisClient),
		async (req, res) => {
			const { data } = await axios.get(
				`${configData.meteoriteUrl}?offset=${req.query.page}&$limit=20`,
			);
			// ParsedQs can be string or string[] or undefined
			// so test if the variable is of type "string"
			if (typeof req.query.page === "string") {
				set(req.query.page, data, redisClient);
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
