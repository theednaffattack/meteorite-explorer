import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { DynamicPageButtons } from "./dynamic-page-buttons";
import "./table-navigation.css";

export function TableNavigation({
	apiLimit,
	data,
	limit,
	offset,
	setOffset,
}: {
	apiLimit: number;
	data: any;
	limit: number;
	offset: number;
	setOffset: React.Dispatch<React.SetStateAction<number>>;
}) {
	return (
		<div className="table-nav">
			<button
				type="button"
				onClick={(evt) => {
					evt.preventDefault();
					if (data && data.length && offset - data.length >= 0) {
						setOffset(0);
					}
				}}
				style={{
					padding: 0,
					display: "flex",
				}}
			>
				<BiFirstPage size={20} />
			</button>
			<button
				className="tooltip"
				type="button"
				disabled={offset <= 0}
				onClick={(evt) => {
					evt.preventDefault();
					if (offset > 0) {
						setOffset((old: number) => old - 20);
					}
				}}
				style={{
					padding: 0,
					display: "flex",
				}}
			>
				<GrFormPrevious size={20} />
			</button>

			<button
				className="tooltip"
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
			<DynamicPageButtons apiLimit={apiLimit} offset={offset} limit={limit} />
			<button
				className="tooltip"
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
				type="button"
				disabled={!data || offset >= apiLimit ? true : false}
				onClick={(evt) => {
					evt.preventDefault();
					if (data && data.length) {
						// setOffset(offset + data.length);
						setOffset((old) => old + 20);
					}
				}}
				style={{
					padding: 0,
					display: "flex",
				}}
			>
				<GrFormNext size={20} />
			</button>

			<button
				type="button"
				disabled={!data || offset >= apiLimit ? true : false}
				onClick={(evt) => {
					evt.preventDefault();
					if (data && data.length) {
						setOffset(1 * apiLimit);
					}
				}}
				style={{
					padding: 0,
					display: "flex",
				}}
			>
				<BiLastPage size={20} />
			</button>
		</div>
	);
}
