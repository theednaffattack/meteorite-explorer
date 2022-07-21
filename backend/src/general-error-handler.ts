export function generalErrorHandler(err: unknown) {
	if (typeof err === "string") {
		throw new Error(err);
	}
	if (err instanceof Error) {
		throw err;
	}
	throw new Error(
		`An uknown error has occurred. ${JSON.stringify(err, null, 2)}`,
	);
}
