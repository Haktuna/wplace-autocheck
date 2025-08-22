import path from "node:path";
import { exit } from "node:process";
import fetch from "node-fetch";
import sharp from "sharp";

const ORIGPATH = path.join(import.meta.dirname, "resources/original.png");

const main = async () => {
	console.log("Hello World!");

	// Sharp loads original drawing and buffers it
	const original = sharp(ORIGPATH).ensureAlpha().raw();
	const originalBuffer = await original.toBuffer();

	const { width: originalWidth, height: originalHeight } =
		await original.metadata();

	try {
		// Requests PNG tile at drawing location
		const tileRes = await fetch(
			"https://backend.wplace.live/files/s0/tiles/1014/711.png",
		);

		// Sends an error if request has failed
		if (!tileRes.ok)
			throw new Error(`Failed to fetch image: ${tileRes.statusText}`);

		// Buffers the PNG tile
		const tileArrayBuffer = await tileRes.arrayBuffer();
		const tileBuffer = Buffer.from(tileArrayBuffer);

		// Crops the tile at given location with original drawing size
		// Currently position for dev purposes only
		const croppedLogoBuffer = await sharp(tileBuffer)
			.ensureAlpha()
			.raw()
			.extract({
				left: 387,
				top: 9,
				width: originalWidth,
				height: originalHeight,
			})
			.toBuffer();

		// Counts the number of different pixel between cropped and original drawings
		let diffPixels = 0;

		// Starts the counting
		for (let i = 0; i < originalBuffer.length; i += 4) {
			const alpha = originalBuffer[i + 3];
			// Ignores transparent pixels
			if (alpha === 0) continue;

			if (
				croppedLogoBuffer[i] !== originalBuffer[i] || // Red
				croppedLogoBuffer[i + 1] !== originalBuffer[i + 1] || // Green
				croppedLogoBuffer[i + 2] !== originalBuffer[i + 2] // Blue
			) {
				diffPixels++;
			}
		}

		console.log(diffPixels);
	} catch (error) {
		console.error(error);
	}
};

await main();

exit(0);
