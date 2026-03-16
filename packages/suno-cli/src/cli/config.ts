import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { SunoClient } from "@yabbal/suno-sdk";

const CONFIG_DIR = join(
	process.env.XDG_CONFIG_HOME || join(homedir(), ".config"),
	"suno",
);
const AUTH_FILE = join(CONFIG_DIR, "auth.json");

export interface AuthSession {
	cookie: string;
}

const ensureConfigDir = () => {
	if (!existsSync(CONFIG_DIR)) {
		mkdirSync(CONFIG_DIR, { recursive: true });
	}
};

export const loadSession = (): AuthSession | null => {
	try {
		if (existsSync(AUTH_FILE)) {
			const data = JSON.parse(readFileSync(AUTH_FILE, "utf-8"));
			if (data.cookie) return data;
		}
	} catch {
		// Ignore
	}
	return null;
};

export const saveSession = (session: AuthSession): void => {
	ensureConfigDir();
	writeFileSync(AUTH_FILE, JSON.stringify(session, null, 2), { mode: 0o600 });
};

export const clearSession = (): void => {
	if (existsSync(AUTH_FILE)) {
		writeFileSync(AUTH_FILE, "{}");
	}
};

export const getCookie = (): string => {
	const envKey = process.env.SUNO_COOKIE;
	if (envKey) return envKey;

	const session = loadSession();
	if (!session?.cookie) {
		throw new Error(
			"Not authenticated. Run `suno auth login` or set SUNO_COOKIE.",
		);
	}
	return session.cookie;
};

export const createClient = (): SunoClient =>
	new SunoClient({ cookie: getCookie() });
