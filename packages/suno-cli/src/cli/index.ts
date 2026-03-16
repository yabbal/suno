import { defineCommand, runMain } from "citty";
import { authCommand } from "./commands/auth";
import { billingCommand } from "./commands/billing";
import { createCompletionCommand } from "./commands/completion";
import { lyricsCommand } from "./commands/lyrics";
import { personasCommand } from "./commands/personas";
import { songsCommand } from "./commands/songs";
import { stemsCommand } from "./commands/stems";
import { versionCommand } from "./commands/version";

declare const __VERSION__: string;

const appCommands = {
	auth: authCommand,
	songs: songsCommand,
	lyrics: lyricsCommand,
	billing: billingCommand,
	stems: stemsCommand,
	personas: personasCommand,
	version: versionCommand,
};

const main = defineCommand({
	meta: {
		name: "suno",
		version: __VERSION__,
		description: "CLI for Suno — AI music generation",
	},
	subCommands: {
		...appCommands,
		completion: createCompletionCommand(appCommands),
	},
});

runMain(main);
