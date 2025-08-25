import fetch from "node-fetch";

export default async (tileUrl) => {
	let downloadOk = false;
	let downloadError = null;
	let tileBuffer = null;
	try {
		// Requests PNG tile at drawing location
		const tileRes = await fetch(tileUrl);

		// Sends an error if request has failed
		if (!tileRes.ok)
			throw new Error(`Failed to fetch image: ${tileRes.statusText}`);

		// Buffers the PNG tile
		const tileArrayBuffer = await tileRes.arrayBuffer();
		tileBuffer = Buffer.from(tileArrayBuffer);
		downloadOk = true;
	} catch (error) {
		downloadError = error;
	}

	return { downloadOk, downloadError, tileBuffer };
};
