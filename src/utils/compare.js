export default (originalBuffer, croppedLogoBuffer) => {
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

	return diffPixels;
};
