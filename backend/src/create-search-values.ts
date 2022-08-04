import { writeFile } from "fs-extra";
import { asyncWrap } from "./async-wrap";

import { cleanMeteorData } from "./data-manipulation/clean-meteor-data";
import meteorData from "./data-manipulation/tmp/meteor-data/meteorData.json";

interface SearchValuesType {
	indexPos: string;
	name: string;
}

export async function createSearchValues() {
	const data = cleanMeteorData(meteorData);
	const searchShortcut: SearchValuesType[] = [];
	const savePath = "./src/data-manipulation/tmp/meteor-data";

	for (let index = 0; index < data.length; index++) {
		const { name } = data[index];
		const forPush = { indexPos: `${index}`, name: name.toLocaleLowerCase() };
		searchShortcut.push(forPush);
	}

	const [searchValues, searchValuesErr] = await asyncWrap(() =>
		writeFile(`${savePath}/searchValues.json`, JSON.stringify(searchShortcut)),
	);

	if (searchValues !== null) {
		console.log("SUCCESS", { searchValues, searchValuesErr });
	}
}
