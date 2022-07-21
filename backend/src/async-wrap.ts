// Adapted from: https://www.youtube.com/watch?v=ITogH7lJTyE&ab_channel=Fireship

export async function asyncWrap<PReturn>(
	promise: () => Promise<PReturn>,
): Promise<[PReturn | null, unknown | null]> {
	try {
		const data = await promise();
		return [data, null];
	} catch (err) {
		return [null, err];
	}
}
