import { type Request, type Response, type NextFunction } from "express";

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
	redisClient: any,
) {
	const key = req.query.page;
	const value = await redisClient.get(key as string);

	// res.status(400).send(error);
	if (typeof key === "string") {
		if (value !== null) {
			// Once we have the value parse it and send it to the client.
			res.status(200).send(JSON.parse(value));
		} else {
			next();
		}
	} else {
		throw new Error(
			`Error parsing 'req.query.page'. The value causing the error is not of type 'string'`,
		);
	}
}
