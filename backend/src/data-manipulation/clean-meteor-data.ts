import { MeteorApiType } from "../types";

export function cleanMeteorData(data: any[]): MeteorApiType[] {
	const cleanedData = [];

	for (const meteor of data) {
		const {
			fall,
			geolocation,
			id,
			mass,
			name,
			nametype,
			recclass,
			reclat,
			reclong,
			year,
		} = meteor;
		const newData = {
			fall,
			geolocation,
			id,
			mass,
			name,
			nametype,
			recclass,
			reclat,
			reclong,
			year,
		};
		cleanedData.push(newData);
	}

	return cleanedData;
}
