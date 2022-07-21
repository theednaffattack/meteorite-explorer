import { type NextFunction, type Request, type Response } from "express";
import { asyncWrap } from "./async-wrap";

/**
 * A route controller function to fetch values from Redis
 * @param req
 * @param res
 * @param next
 */

export async function get(
	req: Request,
	res: Response,
	next: NextFunction,
	redisClient: any, // RedisClientType,
) {
	const key = req.query.page;
	// const value = await redisClient.get(key as string);
	const [redisValue, redisError] = await asyncWrap(() =>
		redisClient.get(key as string),
	);

	// Catch any errors here and send them to the client
	if (redisError) {
		console.error(redisError);
		res.status(400).send(redisError);
	}

	if (typeof key === "string") {
		if (redisValue !== null) {
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
