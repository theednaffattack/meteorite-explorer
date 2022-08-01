import { useEffect, useState } from "react";
import { TextScramble } from "@a7sc11u/scramble";

import "./meteor-table.css";
import { TableNavigation } from "./table-naviagion";
import { SearchForm } from "./search-form";

function Scramble({ text }) {
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

export default function MeteorTable({
	apiLimit,
	offset,
	limit,
	setOffset,
	setLimit,
}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const dataApi = {
		pagination: { offset, limit, apiLimit },
		data: {
			id: 0,
			name: "fake",
			mass: 0,
			nametype: "fake-type",
			recclass: 0,
			reclat: 0,
			reclong: 0,
			fall: "fell",
			year: "0000",
		},
	};

	const nasaApi = `https://data.nasa.gov/resource/gh4g-9sfh.json?$offset=${dataApi.pagination.offset}&$limit=${dataApi.pagination.limit}`;
	const nasaApiNoLimit = `https://data.nasa.gov/resource/gh4g-9sfh.json?$offset=${dataApi.pagination.offset}`;
	// const nasaApiPage = `https://data.nasa.gov/resource/gh4g-9sfh.json?$page=${page}`;

	useEffect(() => {
		fetch(nasaApi)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`This is an HTTP error: The status is ${response.status}`,
					);
				}
				return response.json();
			})
			.then((actualData) => {
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
	}, [offset, limit]);
	const displayingFrom = data && data.length ? offset : "";
	const displayingTo = data && data.length ? offset + data.length : "";
	return (
		<div className="table-wrap">
			<p>
				DISPLAYING: {displayingFrom} - {displayingTo}
			</p>
			<SearchForm />
			<TableNavigation
				apiLimit={apiLimit}
				data={data}
				limit={limit}
				offset={offset}
				setOffset={setOffset}
			/>

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
					{loading && (
						<tr>
							<td>A moment please...</td>
						</tr>
					)}
					{error && (
						<tr>
							<td>{`There is a problem fetching the post data - ${error}`}</td>
						</tr>
					)}

					{data &&
						data.map(
							({
								id,
								name,
								mass,
								nametype,
								recclass,
								reclat,
								reclong,
								fall,
								year,
							}) => {
								const realYear = year ? year.substring(0, 4) : "0000";
								return (
									<tr key={id}>
										<td>{name ? <Scramble text={name} /> : ""}</td>
										<td>{id ? <Scramble text={id} /> : ""}</td>
										<td>{id ? <Scramble text={nametype} /> : ""}</td>
										<td>{recclass ? <Scramble text={recclass} /> : ""}</td>
										<td>{mass ? <Scramble text={mass} /> : ""}</td>
										<td>{fall ? <Scramble text={fall} /> : ""}</td>
										<td>{realYear ? <Scramble text={realYear} /> : ""}</td>
										<td>{reclat ? <Scramble text={reclat} /> : ""}</td>
										<td>{reclong ? <Scramble text={reclong} /> : ""}</td>
									</tr>
								);
							},
						)}
				</tbody>
			</table>
		</div>
	);
}
