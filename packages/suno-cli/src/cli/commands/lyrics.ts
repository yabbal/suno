import { defineCommand } from "citty";
import { createClient } from "../config";
import { formatArg, type OutputFormat, output, outputError } from "../output";

export const lyricsCommand = defineCommand({
	meta: { name: "lyrics", description: "Generate and retrieve lyrics" },
	subCommands: {
		generate: defineCommand({
			meta: { name: "generate", description: "Generate lyrics from a prompt" },
			args: {
				...formatArg,
				prompt: {
					type: "string",
					description: "Text prompt for lyrics generation",
					required: true,
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.lyrics.generate({
						prompt: args.prompt,
					});
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		get: defineCommand({
			meta: {
				name: "get",
				description: "Get generated lyrics by ID (poll result)",
			},
			args: {
				...formatArg,
				id: {
					type: "string",
					description: "Lyrics generation ID",
					required: true,
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.lyrics.get(args.id);
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		aligned: defineCommand({
			meta: {
				name: "aligned",
				description: "Get time-aligned lyrics for a song",
			},
			args: {
				...formatArg,
				id: {
					type: "string",
					description: "Song ID",
					required: true,
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.lyrics.aligned(args.id);
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),
	},
});
