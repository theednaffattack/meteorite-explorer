// import { networkInterfaces } from "node:os";
import { networkInterfaces } from "os";
import defaultGateway from "default-gateway";
import ip from "ipaddr.js";

type FamilyType = "v4" | "v6";

function findIp(gateway: string) {
	const gatewayIp = ip.parse(gateway);

	// Look for the matching interface in all local interfaces.
	for (const addresses of Object.values(networkInterfaces())) {
		if (!addresses) {
			throw new Error("Netowrk interface values missing!");
		}
		for (const { cidr } of addresses) {
			if (!cidr) throw new Error("CIDR missing in addresses");
			const net = ip.parseCIDR(cidr);

			// eslint-disable-next-line unicorn/prefer-regexp-test
			if (
				net[0] &&
				net[0].kind() === gatewayIp.kind() &&
				gatewayIp.match(net)
			) {
				return net[0].toString();
			}
		}
	}
}

async function async(family: FamilyType) {
	try {
		const { gateway } = await defaultGateway[family]();
		return findIp(gateway);
	} catch {}
}

function sync(family: FamilyType) {
	try {
		const { gateway } = defaultGateway[family].sync();
		return findIp(gateway);
	} catch {}
}

export async function internalIpV6() {
	return async("v6");
}

export async function internalIpV4() {
	return async("v4");
}

export function internalIpV6Sync() {
	return sync("v6");
}

export function internalIpV4Sync() {
	return sync("v4");
}
