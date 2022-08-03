import axios from "axios";
import { writeFile } from "fs-extra";
import { asyncWrap } from "../async-wrap";
import type { MeteorApiType } from "../types";
import { createDirIfNotExists } from "./create-dir-if-not-exists";

export async function fetch_meteorite_dataset() {
	const endpointURI = "https://data.nasa.gov/resource/gh4g-9sfh.json";

	const [meteorData, meteorError] = await asyncWrap(() =>
		axios.get<MeteorApiType>(endpointURI, {
			timeout: 45000, // 45000ms request timeout (4.5 sec)
		}),
	);

	if (meteorError && typeof meteorError === "string") {
		throw new Error(meteorError);
	}
	if (meteorError && meteorError instanceof Error) {
		throw meteorError;
	}

	if (!meteorData) {
		throw new Error("Unknown error meteor data is null");
	}

	const dir = "./src/data-manipulation/tmp/meteor-data";
	const filename = "meteorData";
	const fileSuffix = ".json";

	createDirIfNotExists(dir);

	const myWriteFile = async () =>
		await writeFile(
			`${dir}/${filename}.${fileSuffix}`,
			JSON.stringify(meteorData.data),
		);

	const [, writeJsonError] = await asyncWrap(myWriteFile);

	if (writeJsonError && typeof writeJsonError === "string") {
		throw new Error(writeJsonError);
	}
	if (writeJsonError && writeJsonError instanceof Error) {
		throw meteorError;
	}
	return meteorData.data;
}
