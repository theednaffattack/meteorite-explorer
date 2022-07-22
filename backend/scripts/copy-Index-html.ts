import path from "path";
import { copy } from "fs-extra";

export async function copyIndexHtml() {
	const source = path.join(__dirname, "../", "src", "index.html");
	const destination = path.join(__dirname, "../", "dist", "index.html");
	try {
		await copy(source, destination);
		console.log("success!");
	} catch (err) {
		console.error(err);
	}
}
