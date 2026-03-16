import { defineCommand } from "citty";
import { createClient } from "../config";
import { formatArg, type OutputFormat, output, outputError } from "../output";

export const billingCommand = defineCommand({
	meta: { name: "billing", description: "Credit balance and usage" },
	subCommands: {
		info: defineCommand({
			meta: {
				name: "info",
				description: "Get credit balance and usage info",
			},
			args: {
				...formatArg,
			},
			async run({ args }) {
				try {
					const client = createClient();
					const info = await client.billing.info();
					output(info, { format: args.format as OutputFormat });
				} catch (e) {
					outputError(e);
				}
			},
		}),
	},
});
