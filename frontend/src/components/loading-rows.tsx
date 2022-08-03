import { useId } from "react";

export function LoadingRows({
	numberOfRows,
	numberOfColumns,
}: {
	numberOfRows: number;
	numberOfColumns: number;
}) {
	const rowId = useId();
	const cellId = useId();

	const loadingCells = Array.from(Array(numberOfColumns)).map(
		(_, cellIndex) => <td key={cellId + "-" + cellIndex}>loading...</td>,
	);
	const loadingRows = Array.from(Array(numberOfRows)).map((_, rowIndex) => (
		<tr className="table-row" key={rowId + "-" + rowIndex}>
			{loadingCells}
		</tr>
	));

	return <>{loadingRows}</>;
}
