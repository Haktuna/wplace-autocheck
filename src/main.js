import path from "node:path";
import { exit } from "node:process";
import sharp from "sharp";
import compare from "./utils/compare.js";
import download from "./utils/download.js";

const ORIGPATH = path.join(import.meta.dirname, "../resources/original.png");

export default async () => {
	console.log("Hello World!");

	// Sharp loads original drawing and buffers it
	const original = sharp(ORIGPATH).ensureAlpha().raw();
	const originalBuffer = await original.toBuffer();

	// Gets original drawing dimensions
	const { width: originalWidth, height: originalHeight } =
		await original.metadata();

	const { downloadOk, downloadError, tileBuffer } = await download(
		process.env.TILE_URL,
	);

	if (!downloadOk) {
		console.error(downloadError);
		exit(1);
	}

	const croppedLogoBuffer = await sharp(tileBuffer)
		.ensureAlpha()
		.raw()
		.extract({
			left: process.env.LEFT_POS,
			top: process.env.TOP_POS,
			width: originalWidth,
			height: originalHeight,
		})
		.toBuffer();

	// Counts the number of different pixel between cropped and original drawings
	const diffPixels = compare(originalBuffer, croppedLogoBuffer);

	console.log(diffPixels);

	return diffPixels;
};
