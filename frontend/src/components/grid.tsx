import MeteorTable from "./meteor-table";
import "./grid.css";
import { useState } from "react";

export default function Grid() {
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(20);
	const [apiLimit, setApiLimit] = useState(1000);
	return (
		<div className="table-grid">
			<div></div>
			<MeteorTable
				apiLimit={apiLimit}
				offset={offset}
				limit={limit}
				setOffset={setOffset}
				setLimit={setLimit}
			/>
			<div></div>
		</div>
	);
}
