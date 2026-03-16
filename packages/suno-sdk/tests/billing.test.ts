import { describe, it, expect, vi, beforeEach } from "vitest";
import { SunoClient } from "../src/client";

describe("BillingResource", () => {
	let client: SunoClient;

	beforeEach(() => {
		vi.restoreAllMocks();
		client = new SunoClient({ cookie: "test-token" });
	});

	const mockFetch = (data: unknown, status = 200) => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify(data), {
				status,
				headers: { "content-type": "application/json" },
			}),
		);
	};

	const getCall = () => (globalThis.fetch as any).mock.calls[0];

	it("info() should GET api/billing/info/", async () => {
		const mockResponse = {
			total_credits_left: 450,
			period: "monthly",
			monthly_limit: 500,
			monthly_usage: 50,
		};
		mockFetch(mockResponse);

		const result = await client.billing.info();

		const [url, options] = getCall();
		expect(url).toContain("api/billing/info/");
		expect(options.method).toBe("GET");
		expect(result).toEqual(mockResponse);
	});

	it("should send Authorization header with Bearer token", async () => {
		mockFetch({ total_credits_left: 0, period: "", monthly_limit: 0, monthly_usage: 0 });

		await client.billing.info();

		const headers = getCall()[1].headers;
		expect(headers.get("Authorization")).toBe("Bearer test-token");
	});
});
