import { createSearchValues } from "../create-search-values";

createSearchValues()
	.then(() => console.log("HEY"))
	.catch((err) => console.error(err))
	.finally();
