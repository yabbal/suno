import { SunoError } from "./errors";
import { createFetch, type FetchFn } from "./fetch";
import { BillingResource } from "./resources/billing";
import { LyricsResource } from "./resources/lyrics";
import { PersonasResource } from "./resources/personas";
import { SongsResource } from "./resources/songs";
import { StemsResource } from "./resources/stems";
import type { ClientOptions } from "./types";

const DEFAULT_BASE_URL = "https://studio-api.prod.suno.com";

export class SunoClient {
	readonly fetch: FetchFn;

	constructor(options: ClientOptions) {
		this.fetch = createFetch({
			baseURL: options.baseURL ?? DEFAULT_BASE_URL,
			retry: options.retry ?? 2,
			retryDelay: options.retryDelay ?? 500,
			retryStatusCodes: [408, 429, 500, 502, 503, 504],
			onRequest: async ({ options: fetchOptions }) => {
				fetchOptions.headers.set("Authorization", `Bearer ${options.cookie}`);
			},
			onResponseError: ({ request, response }) => {
				throw new SunoError(
					response.statusText || `HTTP ${response.status}`,
					response.status,
					String(request),
					response._data,
				);
			},
		});
	}

	get songs() {
		return new SongsResource(this.fetch);
	}

	get lyrics() {
		return new LyricsResource(this.fetch);
	}

	get billing() {
		return new BillingResource(this.fetch);
	}

	get stems() {
		return new StemsResource(this.fetch);
	}

	get personas() {
		return new PersonasResource(this.fetch);
	}
}
