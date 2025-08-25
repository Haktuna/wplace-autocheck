import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import main from "./main.js";

dotenv.config();
const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	let reset = false;

	setInterval(async () => {
		const diffPixels = await main();

		const channel = await client.channels.fetch(process.env.CHANNEL_ID);
		if (!channel) {
			console.error("Channel not found");
			return;
		}

		if (diffPixels > 0 && !reset) {
			channel.send(`${process.env.MESSAGE}\nDiff pixels: ${diffPixels}`);
			reset = true;
		} else if (diffPixels === 0 && reset) {
			reset = false;
		}
	}, 5 * 1000);
});

client.login(token);
