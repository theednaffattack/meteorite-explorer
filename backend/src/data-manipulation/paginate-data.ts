import { MeteorApiType } from "../types";

export function paginateData<T>({
	data,
	limit,
}: {
	data: T[];
	limit: number;
}): T[][] {
	const newData = [];
	for (let index = 0; index < data.length / limit; index++) {
		const pageData = data.slice(index * limit, limit + limit * index);
		newData[index] = pageData;
	}
	return newData;
}
