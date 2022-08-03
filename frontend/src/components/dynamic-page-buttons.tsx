import "./dynamic-page-buttons.css";

export function DynamicPageButtons({
	apiLimit,
	disabled,
	offset,
	limit,
}: {
	apiLimit: number;
	disabled: boolean;
	offset: number;
	limit: number;
}) {
	const numButtons = 5;

	const rowOfButtons = Array.from(Array(numButtons), (_, buttonIndex) => {
		const buttonText = { 0: null, 1: null, 2: null, 3: null, 4: null };
		const buttonColor = {
			0: "buttonface",
			1: "buttonface",
			2: "buttonface",
			3: "buttonface",
			4: "buttonface",
		};

		// left
		if (offset < 80) {
			buttonText[buttonIndex] = `${buttonIndex + 2}`;
			buttonColor[buttonIndex] =
				buttonText[buttonIndex] === `${offset / limit + 1}`
					? "orange"
					: "buttonface";
			buttonText[4] = `...`;
		}

		// right side
		if (offset >= apiLimit - 80) {
			buttonText[0] = `...`;
			buttonText[1] = `46`;
			buttonText[2] = `47`;
			buttonText[3] = `48`;
			buttonText[4] = `49`;

			buttonColor[buttonIndex] =
				buttonText[buttonIndex] === `${offset / limit}`
					? "orange"
					: "buttonface";
		}

		// middle
		if (offset >= 80 && offset <= apiLimit - 81) {
			buttonText[0] = `...`;
			buttonText[buttonIndex > 0 ? buttonIndex : "uhoh"] = `${
				offset / limit + buttonIndex
			}`;

			buttonColor[buttonIndex] =
				buttonText[buttonIndex] === `${offset / limit + 1}`
					? "orange"
					: "buttonface";
			buttonText[4] = `...`;
		}

		return (
			<button
				className={buttonText[buttonIndex] === "..." ? "no-tooltip" : "tooltip"}
				disabled={disabled}
				type="button"
				key={`page-${buttonIndex}`}
				style={{
					backgroundColor: buttonColor[buttonIndex],
				}}
			>
				{buttonText[buttonIndex]}

				<span className="tooltiptext">
					{offset} - {offset + limit}
				</span>
			</button>
		);
	});

	return <>{rowOfButtons}</>;
}
