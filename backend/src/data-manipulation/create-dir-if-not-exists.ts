import { existsSync, mkdirSync } from "fs-extra";

export function createDirIfNotExists(dir: string): boolean {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
		return true;
	}
	return false;
}
