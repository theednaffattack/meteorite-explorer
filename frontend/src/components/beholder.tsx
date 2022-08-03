import { type PropsWithChildren } from "react";

export interface MapViewerProps {
	id: string;
	name: string;
	mass: string;
	nametype: string;
	recclass: string;
	reclat: string;
	reclong: string;
	fall: string;
	year: string;
}

interface BeholderProps {
	setViewer: React.Dispatch<React.SetStateAction<MapViewerProps>>;
	viewer: MapViewerProps;
}

export type BeholderPropsToo = PropsWithChildren<BeholderProps>;

export function Beholder({ viewer, setViewer, children }: BeholderPropsToo) {
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				right: 0,
				zIndex: 1,
				backgroundColor: "orange",
				minHeight: "200px",
				width: "150px",
			}}
		>
			{children}
		</div>
	);
}
