import type { FetchFn } from "../fetch";
import type { StemsResponse } from "../types";

export class StemsResource {
	constructor(private readonly fetch: FetchFn) {}

	/** Separate a song into stems (vocals/instrumental) */
	create(songId: string) {
		return this.fetch<StemsResponse>(`api/edit/stems/${songId}`, {
			method: "POST",
			body: {},
		});
	}
}
