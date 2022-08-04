import { useRef, useEffect } from "react";

interface SearchFormItemsProps {
	items: any[];
	selected: number;
}

export function SearchFormItems({ items, selected }: SearchFormItemsProps) {
	const itemsRef = useRef([]);
	// you can access the elements with itemsRef.current[n]

	useEffect(() => {
		itemsRef.current = itemsRef.current.slice(0, items.length);
	}, [items]);

	return (
		<ul className="search-results-list">
			{items.map((result, resultIndex) => (
				<li
					ref={(liItem) => (itemsRef.current[resultIndex] = liItem)}
					tabIndex={0}
					key={result.item.name + "-" + result.item.indexPos}
					className={selected === resultIndex ? "selected" : null}
				>
					{result.item.name}
				</li>
			))}
		</ul>
	);
}
