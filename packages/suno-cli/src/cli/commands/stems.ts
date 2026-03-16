import { defineCommand } from "citty";
import { createClient } from "../config";
import { formatArg, type OutputFormat, output, outputError } from "../output";

export const stemsCommand = defineCommand({
	meta: { name: "stems", description: "Separate songs into stems" },
	subCommands: {
		create: defineCommand({
			meta: {
				name: "create",
				description: "Separate a song into stems (vocals/instrumental)",
			},
			args: {
				...formatArg,
				id: {
					type: "string",
					description: "Song ID to separate",
					required: true,
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.stems.create(args.id);
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),
	},
});
