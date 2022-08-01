import { useState } from "react";
import { useForm } from "react-hook-form";

export function SearchForm() {
	const { register, handleSubmit, getValues } = useForm();

	const [previousSearchTerms, setPreviousSearchTerms] = useState([]);
	const [visible, setVisible] = useState("");
	const [buttonDisabled, setButtonDisabled] = useState<"disabled" | "usable">(
		"usable",
	);

	function handleSearch(data: { search: string }) {
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
	}

	function handleFocus(evt: any) {
		evt.preventDefault();
		console.log("FOCUS");
		if (previousSearchTerms.length) {
			setVisible("visible");
		}
	}

	function handleBlur(evt: any) {
		setVisible("");
	}

	function handleChange(evt: any) {
		const disableButton = previousSearchTerms.includes(getValues("search"));
		if (disableButton) {
			setButtonDisabled("disabled");
		}
	}

	return (
		<form onSubmit={handleSubmit(handleSearch)}>
			<div className="search-form">
				<div className="input-wrap">
					<input
						type="text"
						name="search"
						{...register("search")}
						// onChange={handleChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
					/>

					<div
						className="previous-search"
						style={{ display: visible === "" ? "none" : "flex" }}
					>
						{previousSearchTerms.map((searchTerm) => (
							<div key={searchTerm}>{searchTerm}</div>
						))}
					</div>
				</div>
				<button type="submit" disabled={buttonDisabled === "disabled"}>
					Search
				</button>
			</div>
		</form>
	);
}
