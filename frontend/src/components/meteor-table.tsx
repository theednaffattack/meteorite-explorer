import { useEffect, useState } from "react";
import "./meteor-table.css";

export default function MeteorTable() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch(`https://jsonplaceholder.typicode.com/posts?_limit=8`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`,
					);
				}
				return response.json();
			})
			.then((actualData) => {
				console.log("VIEW ACTUAL DATA", actualData);
				setData(actualData);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
				setData(null);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>ID</th>
					<th>Name Type</th>
					<th>Rec Class</th>
					<th>Mass (g)</th>
					<th>Fall</th>
					<th>Year</th>
					<th>Latitude</th>
					<th>Longitude</th>
				</tr>
			</thead>

			<tbody>
				{loading && <tr>A moment please...</tr>}
				{error && (
					<tr>{`There is a problem fetching the post data - ${error}`}</tr>
				)}

				{data &&
					data.map(
						({
							id,
							latitude,
							longitude,
							name,
							mass,
							nameType,
							recClass,
							fall,
							year,
							title,
						}) => {
							return (
								<tr>
									<td>TestName</td>
									<td>Test ID</td>
									<td>Test Name Type</td>
									<td>Test Rec Class</td>
									<td>Test Mass</td>
									<td>Test Fall</td>
									<td>Test Year</td>
									<td>Test Latitude</td>
									<td>Test Longitude</td>
								</tr>
							);
						},
					)}
			</tbody>
		</table>
	);
}
