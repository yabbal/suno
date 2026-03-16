import type { FetchFn } from "../fetch";
import type {
	AlignedLyricsResponse,
	GenerateLyricsParams,
	LyricsGeneration,
} from "../types";

export class LyricsResource {
	constructor(private readonly fetch: FetchFn) {}

	/** Generate lyrics from a prompt */
	generate(params: GenerateLyricsParams) {
		return this.fetch<LyricsGeneration>("api/generate/lyrics/", {
			method: "POST",
			body: params,
		});
	}

	/** Get generated lyrics by ID (poll until status is "complete") */
	get(id: string) {
		return this.fetch<LyricsGeneration>(`api/generate/lyrics/${id}`);
	}

	/** Get time-aligned lyrics for a song */
	aligned(songId: string) {
		return this.fetch<AlignedLyricsResponse>(
			`api/gen/${songId}/aligned_lyrics/v2/`,
		);
	}
}
