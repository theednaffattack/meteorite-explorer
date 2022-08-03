interface GeoLocationProps {
	latitude: string;
	longitude: string;
}

export interface MeteorApiType {
	id: number;
	geolocation: GeoLocationProps;
	name: string;
	mass: number;
	nametype: string;
	recclass: number;
	reclat: number;
	reclong: number;
	fall: string;
	year: string;
}

export type MeteorType = Omit<MeteorApiType, "geolocation">;
