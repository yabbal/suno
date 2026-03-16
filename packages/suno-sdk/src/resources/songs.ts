import type { FetchFn } from "../fetch";
import type {
	Clip,
	ConcatParams,
	FeedParams,
	FeedResponse,
	GenerateCustomParams,
	GenerateDescriptionParams,
	GenerateExtendParams,
	GenerateResponse,
	SetVisibilityParams,
} from "../types";

export class SongsResource {
	constructor(private readonly fetch: FetchFn) {}

	/** Generate songs from a text description (returns 2 clips) */
	generate(params: GenerateDescriptionParams) {
		return this.fetch<GenerateResponse>("api/generate/v2/", {
			method: "POST",
			body: {
				...params,
				generation_type: "TEXT",
				mv: params.mv ?? "chirp-v4",
			},
		});
	}

	/** Generate songs with custom lyrics, tags, and title */
	generateCustom(params: GenerateCustomParams) {
		return this.fetch<GenerateResponse>("api/generate/v2/", {
			method: "POST",
			body: {
				...params,
				generation_type: "TEXT",
				mv: params.mv ?? "chirp-v4",
			},
		});
	}

	/** Extend an existing song */
	extend(params: GenerateExtendParams) {
		return this.fetch<GenerateResponse>("api/generate/v2/", {
			method: "POST",
			body: {
				...params,
				generation_type: "TEXT",
				task: "extend",
				mv: params.mv ?? "chirp-v4",
			},
		});
	}

	/** Concatenate segments into a full song */
	concat(params: ConcatParams) {
		return this.fetch<GenerateResponse>("api/generate/concat/v2/", {
			method: "POST",
			body: params,
		});
	}

	/** List songs from the feed */
	list(params?: FeedParams) {
		return this.fetch<FeedResponse>("api/feed/v2", {
			query: params as Record<string, unknown>,
		});
	}

	/** Get a single clip by ID */
	get(id: string) {
		return this.fetch<Clip>(`api/clip/${id}`);
	}

	/** Set song visibility (public/private) */
	setVisibility(id: string, params: SetVisibilityParams) {
		return this.fetch<void>(`api/gen/${id}/set_visibility/`, {
			method: "POST",
			body: params,
		});
	}
}
