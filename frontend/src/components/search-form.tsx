import axios from "axios";
import Fuse from "fuse.js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import meteorData from "../data/searchValues.json";
import { clamp } from "./clamp";
import { SearchFormItems } from "./search-form-items";

export function SearchForm({
	disabled,
	offset,
	limit,
	setData,
}: {
	disabled: boolean;
	offset: number;
	limit: number;
	setData: React.Dispatch<any>;
}) {
	const theName = "";
	const whereClause = `&$where=name="${theName}"`;
	const searchUri = `https://data.nasa.gov/resource/gh4g-9sfh.json?$offset=${offset}&$limit=${limit}`;

	const { register, handleSubmit, getValues, setValue } = useForm();
	const [fuzzySearch, setFuzzySearch] = useState<
		null | Fuse.FuseResult<{ indexPos: string; name: string }>[]
	>(null);
	const [previousSearchTerms, setPreviousSearchTerms] = useState([]);
	const [visible, setVisible] = useState("");
	const [buttonDisabled, setButtonDisabled] = useState<"disabled" | "usable">(
		"usable",
	);

	const [selectedIndex, setSelectedIndex] = useState(0);

	async function handleSearch(data: { search: string }) {
		console.log("HANDLE SUBMIT", { search: data.search });
		if (data.search === "") {
			return;
		}
		// don't submit duplicate values
		if (previousSearchTerms.includes(getValues("search"))) {
			return;
		}
		setPreviousSearchTerms((oldState) => {
			const clone = oldState.slice(0, oldState.length);
			const newState = [data.search, ...clone];
			return newState;
		});

		// TODO: Axios call that we can use to set the data

		const response = await axios.get(
			`${import.meta.env.PUBLIC_DEV_API_URI}?name=${data.search}`,
		);

		setData((prevData) => {
			console.log("PREV DATA", { prevData, response });
			return prevData;
		});
	}

	function handleFocus(evt: any) {
		evt.preventDefault();

		if (previousSearchTerms.length) {
			setVisible("visible");
		}
	}

	function handleBlur(evt: React.FocusEvent<HTMLInputElement>) {
		setVisible("");
	}

	function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
		const selected = "whatever";

		const myValue = evt.target.value;

		const options = {
			includeScore: true,
			// Search in `name` array
			keys: ["name"],
		};

		const fuse = new Fuse(meteorData, options);

		const fuzzyResultsFull = fuse.search(myValue);

		// const response = await axios.get(
		// 	`${import.meta.env.PUBLIC_DEV_API_URI}?name=${selected}`,
		// );

		const highestRankedResults = fuzzyResultsFull.slice(0, 4);

		setFuzzySearch(highestRankedResults);
		setVisible("visible");
	}

	const fuzzyLimit = 3;

	return (
		<form onSubmit={handleSubmit(handleSearch)}>
			<div className="search-form">
				<div className="input-wrap">
					<input
						type="text"
						name="search"
						disabled={disabled}
						{...register("search", {
							onBlur: handleBlur,
							onChange: handleChange,
						})}
						onKeyDown={function handleKeyDown(
							evt: React.KeyboardEvent<HTMLInputElement>,
						) {
							// See named keys: https://www.w3.org/TR/uievents-key/#named-key-attribute-values
							const watchedKeys = ["ArrowUp", "ArrowDown", "Enter"];
							if (
								watchedKeys.some((watchedKey) => {
									return watchedKey === evt.key;
								})
							) {
								evt.preventDefault();

								if (evt.key === "ArrowDown") {
									setSelectedIndex((prevState) => {
										return clamp({
											num: prevState + 1,
											min: 0,
											max: fuzzyLimit,
										});
									});
								}
								if (evt.key === "ArrowUp") {
									setSelectedIndex((prevState) => {
										return clamp({
											num: prevState - 1,
											min: 0,
											max: fuzzyLimit,
										});
									});
								}
								if (evt.key === "Enter") {
									//

									console.log("WHAT IS THIS VALUE", fuzzySearch[selectedIndex]);
									handleSearch({
										search: fuzzySearch[selectedIndex].item.name,
									});
									setValue("search", fuzzySearch[selectedIndex].item.name);
								}
							}
						}}
						onFocus={handleFocus}
					/>

					<div
						className="previous-search"
						style={{ display: visible === "" ? "none" : "flex" }}
					>
						{fuzzySearch && fuzzySearch.length ? (
							<ul className="search-results-list">
								{fuzzySearch ? (
									<SearchFormItems
										items={fuzzySearch}
										selected={selectedIndex}
									/>
								) : null}
							</ul>
						) : null}
						{previousSearchTerms && previousSearchTerms.length ? (
							<>
								<div className="previous-searches-header-wrap">
									<p className="previous-searches-header">PREVIOUS SEARCHES:</p>
								</div>
								<ul className="search-results-list">
									{previousSearchTerms.map((searchTerm) => (
										<li key={searchTerm}>{searchTerm}</li>
									))}
								</ul>
							</>
						) : null}
					</div>
				</div>
				<button type="submit" disabled={buttonDisabled === "disabled"}>
					Search
				</button>
			</div>
		</form>
	);
}
