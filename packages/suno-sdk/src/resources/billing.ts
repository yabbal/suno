import type { FetchFn } from "../fetch";
import type { BillingInfo } from "../types";

export class BillingResource {
	constructor(private readonly fetch: FetchFn) {}

	/** Get credit balance and usage info */
	info() {
		return this.fetch<BillingInfo>("api/billing/info/");
	}
}
