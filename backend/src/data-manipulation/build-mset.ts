import { MeteorApiType } from "../types";

type MSet<U> = (string | U[])[];

export function buildMset<T>({ data, limit }: { data: T[]; limit: number }) {
	const keys = [];
	const newData = [];
	const finalData = [];
	for (let index = 0; index < data.length / limit; index++) {
		const pageData = data.slice(index * limit, limit + limit * index);
		keys[index] = `${index * limit}`;
		newData[index] = pageData;
	}

	for (let index = 0; index < keys.length; index++) {
		const strKey = keys[index];
		const strData = newData[index];
		finalData.push(strKey);
		finalData.push(JSON.stringify(strData));
	}

	return finalData;
}
