import { defineCommand } from "citty";
import { createClient } from "../config";
import { formatArg, type OutputFormat, output, outputError } from "../output";

export const personasCommand = defineCommand({
	meta: { name: "personas", description: "Manage voice personas" },
	subCommands: {
		get: defineCommand({
			meta: { name: "get", description: "Get a persona by ID" },
			args: {
				...formatArg,
				id: {
					type: "string",
					description: "Persona ID",
					required: true,
				},
				page: {
					type: "string",
					description: "Page number",
				},
			},
			async run({ args }) {
				try {
					const client = createClient();
					const result = await client.personas.get(
						args.id,
						args.page ? Number(args.page) : undefined,
					);
					output(result, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),
	},
});
