import { useEffect, useState } from "react";
import { LoadingRows } from "./loading-rows";

import "./meteor-table.css";
import { Scramble } from "./scramble";
import { SearchForm } from "./search-form";
import { SiteHeader } from "./site-header";
import { TableNavigation } from "./table-naviagion";

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

	const apiUriNoLimit = `https://data.nasa.gov/resource/gh4g-9sfh.json?$offset=${dataApi.pagination.offset}`;

	const apiUri = `https://data.nasa.gov/resource/gh4g-9sfh.json?$offset=${dataApi.pagination.offset}&$limit=${dataApi.pagination.limit}`;
	const devApi = `${import.meta.env.PUBLIC_DEV_API_URI}?$offset=${
		dataApi.pagination.offset
	}&$limit=${dataApi.pagination.limit}`;
	useEffect(() => {
		fetch(devApi)
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

	const errorRows = Array.from(Array(20)).map((_, errorRowIndex) => (
		<tr className="table-row" key={`${errorRowIndex}`}>
			<td className="error-cell">No data. Error!</td>
		</tr>
	));

	const numberOfColumns = 9;

	// const loadingRows = Array.from(Array(limit)).map((_, errorRowIndex) => (
	// 	<tr className="table-row" key={`${errorRowIndex}`}>
	// 		{loadingCells}
	// 	</tr>
	// ));

	return (
		<div>
			<div className="table-wrap">
				<SiteHeader />
				<SearchForm disabled={loading} limit={limit} offset={offset} />
				<TableNavigation
					apiLimit={apiLimit}
					data={data}
					disabled={loading}
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
							<LoadingRows numberOfColumns={9} numberOfRows={limit} />
						)}
						{!loading && error && errorRows}

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
										<tr className="table-row" key={`row-${id}`}>
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

				<TableNavigation
					apiLimit={apiLimit}
					disabled={loading}
					data={data}
					limit={limit}
					offset={offset}
					setOffset={setOffset}
				/>
			</div>
		</div>
	);
}
