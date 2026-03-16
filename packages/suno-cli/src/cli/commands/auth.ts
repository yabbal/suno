import * as p from "@clack/prompts";
import { defineCommand } from "citty";
import { clearSession, loadSession, saveSession } from "../config";
import { output, outputError } from "../output";

export const authCommand = defineCommand({
	meta: { name: "auth", description: "Authentication management" },
	subCommands: {
		login: defineCommand({
			meta: {
				name: "login",
				description: "Log in with your Suno access token",
			},
			args: {
				cookie: {
					type: "string",
					description: "Suno cookie/token (for CI/scripts)",
				},
			},
			async run({ args }) {
				if (args.cookie) {
					try {
						saveSession({ cookie: args.cookie });
						output({ status: "authenticated" });
					} catch (e) {
						outputError(e);
					}
					return;
				}

				p.intro("Suno Login");

				p.note(
					"1. Open suno.com in your browser (logged in)\n2. Open DevTools (F12) → Network tab\n3. Find any request to studio-api.prod.suno.com\n4. Copy the Authorization header value (without 'Bearer ')",
					"How to get your token",
				);

				const cookie = await p.password({
					message: "Paste your access token",
					validate: (value) => {
						if (!value) return "Access token is required";
					},
				});

				if (p.isCancel(cookie)) {
					p.cancel("Login cancelled.");
					return;
				}

				saveSession({ cookie });
				p.outro("Authenticated successfully!");
			},
		}),

		logout: defineCommand({
			meta: { name: "logout", description: "Log out" },
			run() {
				clearSession();
				output({ status: "logged_out" });
			},
		}),

		status: defineCommand({
			meta: { name: "status", description: "Show authentication status" },
			run() {
				const session = loadSession();
				output({
					authenticated: !!session?.cookie,
				});
			},
		}),
	},
});
