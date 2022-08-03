import { DynamicPageButtons } from "./dynamic-page-buttons";
import "./table-navigation.css";

export function TableNavigation({
	apiLimit,
	data,
	disabled,
	limit,
	offset,
	setOffset,
}: {
	apiLimit: number;
	data: any;
	disabled: boolean;
	limit: number;
	offset: number;
	setOffset: React.Dispatch<React.SetStateAction<number>>;
}) {
	return (
		<div className="table-nav">
			<button
				className="icon-button"
				id="first-button"
				type="button"
				disabled={disabled}
				onClick={(evt) => {
					evt.preventDefault();
					if (data && data.length && offset - data.length >= 0) {
						setOffset(0);
					}
				}}
			>
				<svg
					stroke="currentColor"
					fill="currentColor"
					strokeWidth="0"
					viewBox="0 0 24 24"
					height="1.5em"
					width="1.5em"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="m16.293 17.707 1.414-1.414L13.414 12l4.293-4.293-1.414-1.414L10.586 12zM7 6h2v12H7z"></path>
				</svg>
			</button>
			<button
				id="previous-button"
				className="icon-button"
				type="button"
				disabled={offset <= 0 || disabled}
				onClick={(evt) => {
					evt.preventDefault();
					if (offset > 0) {
						setOffset((old: number) => old - 20);
					}
				}}
			>
				<svg
					stroke="currentColor"
					fill="currentColor"
					strokeWidth="0"
					viewBox="0 0 24 24"
					height="1.5em"
					width="1.5em"
					xmlns="http://www.w3.org/2000/svg"
				>
					<polyline
						fill="none"
						// stroke="#000"
						stroke="currentColor"
						strokeWidth="2"
						points="9 6 15 12 9 18"
						transform="matrix(-1 0 0 1 24 0)"
					></polyline>
				</svg>
			</button>

			<button
				className="tooltip"
				disabled={disabled}
				type="button"
				onClick={(evt) => {
					evt.preventDefault();
					if (data && data.length && offset - data.length >= 0) {
						setOffset(0);
					}
				}}
				style={{
					backgroundColor:
						"0" === `${offset / limit}` ? "orange" : "ButtonFace",
				}}
			>
				{"1"}
				<span className="tooltiptext">{"1"}</span>
			</button>
			<DynamicPageButtons
				disabled={disabled}
				apiLimit={apiLimit}
				offset={offset}
				limit={limit}
			/>
			<button
				className="tooltip"
				disabled={disabled}
				type="button"
				onClick={(evt) => {
					evt.preventDefault();
					setOffset(1 * apiLimit);
				}}
				style={{
					backgroundColor:
						"50" === `${offset / limit}` ? "orange" : "ButtonFace",
				}}
			>
				{"50"}

				<span className="tooltiptext">{"50"}</span>
			</button>
			<button
				id="next-button"
				className="icon-button"
				type="button"
				disabled={disabled || !data || offset >= apiLimit ? true : false}
				onClick={(evt) => {
					evt.preventDefault();
					if (data && data.length) {
						// setOffset(offset + data.length);
						setOffset((old) => old + 20);
					}
				}}
			>
				<svg
					stroke="currentColor"
					fill="currentColor"
					strokeWidth="0"
					viewBox="0 0 24 24"
					height="1.5em"
					width="1.5em"
					xmlns="http://www.w3.org/2000/svg"
				>
					<polyline
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						points="9 6 15 12 9 18"
					></polyline>
				</svg>
			</button>

			<button
				type="button"
				id="last-button"
				className="icon-button"
				disabled={disabled || !data || offset >= apiLimit ? true : false}
				onClick={(evt) => {
					evt.preventDefault();
					if (data && data.length) {
						setOffset(1 * apiLimit);
					}
				}}
			>
				<svg
					stroke="currentColor"
					fill="currentColor"
					strokeWidth="0"
					viewBox="0 0 24 24"
					height="1.5em"
					width="1.5em"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M7.707 17.707 13.414 12 7.707 6.293 6.293 7.707 10.586 12l-4.293 4.293zM15 6h2v12h-2z"></path>
				</svg>
			</button>
		</div>
	);
}
