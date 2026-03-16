import { defineCommand } from "citty";
import { createClient } from "../config";
import { formatArg, type OutputFormat, output, outputError } from "../output";

export const songsCommand = defineCommand({
	meta: { name: "songs", description: "Generate and manage songs" },
	subCommands: {
		generate: defineCommand({
			meta: {
				name: "generate",
				description: "Generate songs from a description",
			},
			args: {
				...formatArg,
				prompt: {
					type: "string",
					description: "Text description of the song to generate",
					required: true,
				},
				instrumental: {
					type: "boolean",
					description: "Generate instrumental only",
					default: false,
				},
				model: {
					type: "string",
					description: "Model version (e.g. chirp-v4)",
					default: "chirp-v4",
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.songs.generate({
						gpt_description_prompt: args.prompt,
						make_instrumental: args.instrumental,
						mv: args.model,
					});
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		custom: defineCommand({
			meta: {
				name: "custom",
				description: "Generate songs with custom lyrics and tags",
			},
			args: {
				...formatArg,
				lyrics: {
					type: "string",
					description: "Song lyrics",
					required: true,
				},
				tags: {
					type: "string",
					description: "Music style tags (e.g. pop, electronic)",
					required: true,
				},
				title: {
					type: "string",
					description: "Song title",
					required: true,
				},
				"negative-tags": {
					type: "string",
					description: "Tags to exclude",
				},
				instrumental: {
					type: "boolean",
					description: "Generate instrumental only",
					default: false,
				},
				model: {
					type: "string",
					description: "Model version",
					default: "chirp-v4",
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.songs.generateCustom({
						prompt: args.lyrics,
						tags: args.tags,
						title: args.title,
						negative_tags: args["negative-tags"],
						make_instrumental: args.instrumental,
						mv: args.model,
					});
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		extend: defineCommand({
			meta: { name: "extend", description: "Extend an existing song" },
			args: {
				...formatArg,
				id: {
					type: "string",
					description: "Clip ID to extend",
					required: true,
				},
				at: {
					type: "string",
					description: "Timestamp in seconds to continue from",
					required: true,
				},
				lyrics: {
					type: "string",
					description: "Continuation lyrics",
				},
				tags: {
					type: "string",
					description: "Music style tags",
				},
				title: {
					type: "string",
					description: "Song title",
				},
				model: {
					type: "string",
					description: "Model version",
					default: "chirp-v4",
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.songs.extend({
						continue_clip_id: args.id,
						continue_at: Number(args.at),
						prompt: args.lyrics,
						tags: args.tags,
						title: args.title,
						mv: args.model,
					});
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		concat: defineCommand({
			meta: {
				name: "concat",
				description: "Concatenate segments into a full song",
			},
			args: {
				...formatArg,
				id: {
					type: "string",
					description: "Clip ID to concatenate",
					required: true,
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.songs.concat({ clip_id: args.id });
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		list: defineCommand({
			meta: { name: "list", description: "List songs from feed" },
			args: {
				...formatArg,
				page: {
					type: "string",
					description: "Page number",
				},
				ids: {
					type: "string",
					description: "Comma-separated clip IDs",
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.songs.list({
						page: args.page ? Number(args.page) : undefined,
						ids: args.ids,
					});
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		get: defineCommand({
			meta: { name: "get", description: "Get a single song by ID" },
			args: {
				...formatArg,
				id: {
					type: "string",
					description: "Clip ID",
					required: true,
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const clip = await client.songs.get(args.id);
					output(clip, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),

		visibility: defineCommand({
			meta: {
				name: "visibility",
				description: "Set song visibility (public/private)",
			},
			args: {
				id: {
					type: "string",
					description: "Song ID",
					required: true,
				},
				public: {
					type: "boolean",
					description: "Set to public (true) or private (false)",
					required: true,
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					await client.songs.setVisibility(args.id, {
						is_public: args.public,
					});
					output({
						status: "updated",
						id: args.id,
						is_public: args.public,
					});
				} catch (e) {
					outputError(e);
				}
			},
		}),
	},
});
