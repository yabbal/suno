import { describe, it, expect, vi, beforeEach } from "vitest";
import { SunoClient } from "../src/client";

describe("StemsResource", () => {
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

	it("create() should POST to api/edit/stems/{id}", async () => {
		const mockResponse = { clips: [{ id: "stem-1" }, { id: "stem-2" }] };
		mockFetch(mockResponse);

		const result = await client.stems.create("song-456");

		const [url, options] = getCall();
		expect(url).toContain("api/edit/stems/song-456");
		expect(options.method).toBe("POST");
		const body = JSON.parse(options.body);
		expect(body).toEqual({});
		expect(result).toEqual(mockResponse);
	});

	it("should send Authorization header with Bearer token", async () => {
		mockFetch({ clips: [] });

		await client.stems.create("any-id");

		const headers = getCall()[1].headers;
		expect(headers.get("Authorization")).toBe("Bearer test-token");
	});
});
