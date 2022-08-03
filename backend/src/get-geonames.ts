import axios from "axios";

interface GetGeonamesProps {
	username: string;
	lat: string;
	lng: string;
	api: ApiType;
}

type ApiType = "countryCodeJSON";

type CountryCodeApiReturn = {
	languages: string;
	distance: string;
	countryCode: string;
	countryName: string;
};

const meteoriteCountryCodesReturn = {
	languages: "de",
	distance: "0",
	countryCode: "DE",
	countryName: "Germany",
};

export async function getGeonames({
	api,
	lat,
	lng,
	username,
}: GetGeonamesProps): Promise<CountryCodeApiReturn> {
	const apiUri = `http://api.geonames.org/${api}?lat=${lat}&lng=${lng}&username=${username}`;
	return (await axios.get<CountryCodeApiReturn>(apiUri)).data;
}
