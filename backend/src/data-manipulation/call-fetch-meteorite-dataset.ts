import { fetch_meteorite_dataset } from "./fetch-meteorite-dataset";

fetch_meteorite_dataset()
	.then()
	.catch((err) => console.error(err))
	.finally();
