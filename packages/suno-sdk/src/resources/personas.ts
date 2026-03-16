import type { FetchFn } from "../fetch";
import type { PersonaResponse } from "../types";

export class PersonasResource {
	constructor(private readonly fetch: FetchFn) {}

	/** Get a persona by ID */
	get(id: string, page?: number) {
		return this.fetch<PersonaResponse>(
			`api/persona/get-persona-paginated/${id}/`,
			{
				query: page !== undefined ? { page } : undefined,
			},
		);
	}
}
