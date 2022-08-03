import { type NextFunction, type Request, type Response } from "express";
import { asyncWrap } from "./async-wrap";
import { getGeonames } from "./get-geonames";
import { redisClient } from "./server";

/**
 * A route controller function to fetch values from Redis
 * @param req
 * @param res
 * @param next
 */

export async function getRedisData(
	req: Request,
	res: Response,
	next: NextFunction,
	// redisClient: any, // RedisClientType,
) {
	const reqQueryEmpty = Object.keys(req.query).length === 0;

	if (reqQueryEmpty) {
		console.log("REQ QUERY IS EMPTY USING DEFAULT (0)");
	}
	const key = req.query.$offset || "0";

	const [redisValue, redisError] = await asyncWrap(() => {
		return redisClient.get(key as string);
	});

	// Catch any errors here and send them to the client
	if (redisError) {
		console.error(redisError);
		res.status(400).send(redisError);
	}

	if (typeof key === "string") {
		if (redisValue !== null) {
			const parsedValue = JSON.parse(redisValue);

			const lat = parsedValue[0].reclat;
			const lng = parsedValue[0].reclong;

			const [meteoriteCountryCodes, countryCodesError] = await asyncWrap(() =>
				getGeonames({
					api: "countryCodeJSON",
					lat,
					lng,
					username: "eddienaff",
				}),
			);

			if (typeof countryCodesError === "string") {
				throw new Error(countryCodesError);
			}
			if (countryCodesError instanceof Error) {
				throw new Error(countryCodesError.message);
			}

			// Once we have the value parse it and send it to the client.
			res.status(200).send(JSON.parse(redisValue as string));
		} else {
			next();
		}
	} else {
		throw new Error(
			`Error parsing 'req.query.page'. The value causing the error is not of type 'string'`,
		);
	}
}
