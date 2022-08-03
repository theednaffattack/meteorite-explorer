import { TextScramble } from "@a7sc11u/scramble";

export function Scramble({ text }) {
	return (
		<TextScramble
			play={true}
			speed={1}
			scramble={8}
			step={1}
			stepInterval={1}
			seed={3}
			seedInterval={10}
			text={text}
		/>
	);
}
