interface ClampProps {
	num: number;
	min: number;
	max: number;
}

// Clamp number between two values with the following line:
export function clamp({ num, min, max }: ClampProps): number {
	return Math.min(Math.max(num, min), max);
}
