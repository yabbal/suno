import { describe, it, expect, vi, beforeEach } from "vitest";
import { SunoClient } from "../src/client";

describe("PersonasResource", () => {
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

	it("get() should GET api/persona/get-persona-paginated/{id}/", async () => {
		const mockResponse = {
			persona: { id: "persona-1", name: "Test Persona" },
			total_results: 10,
			current_page: 0,
			is_following: false,
		};
		mockFetch(mockResponse);

		const result = await client.personas.get("persona-1");

		const [url, options] = getCall();
		expect(url).toContain("api/persona/get-persona-paginated/persona-1/");
		expect(options.method).toBe("GET");
		expect(result).toEqual(mockResponse);
	});

	it("get() should pass page as query param", async () => {
		mockFetch({
			persona: { id: "persona-1" },
			total_results: 50,
			current_page: 3,
			is_following: true,
		});

		await client.personas.get("persona-1", 3);

		const [url] = getCall();
		expect(url).toContain("page=3");
	});

	it("get() should not include page param when not provided", async () => {
		mockFetch({
			persona: { id: "persona-1" },
			total_results: 10,
			current_page: 0,
			is_following: false,
		});

		await client.personas.get("persona-1");

		const [url] = getCall();
		expect(url).not.toContain("page=");
	});

	it("should send Authorization header with Bearer token", async () => {
		mockFetch({
			persona: { id: "x" },
			total_results: 0,
			current_page: 0,
			is_following: false,
		});

		await client.personas.get("x");

		const headers = getCall()[1].headers;
		expect(headers.get("Authorization")).toBe("Bearer test-token");
	});
});
