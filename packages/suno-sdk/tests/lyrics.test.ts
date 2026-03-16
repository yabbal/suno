import { describe, it, expect, vi, beforeEach } from "vitest";
import { SunoClient } from "../src/client";

describe("LyricsResource", () => {
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

	it("generate() should POST to api/generate/lyrics/", async () => {
		const mockResponse = { id: "lyrics-1", status: "running", title: "", text: "" };
		mockFetch(mockResponse);

		const result = await client.lyrics.generate({ prompt: "a love song" });

		const [url, options] = getCall();
		expect(url).toContain("api/generate/lyrics/");
		expect(options.method).toBe("POST");
		const body = JSON.parse(options.body);
		expect(body.prompt).toBe("a love song");
		expect(result).toEqual(mockResponse);
	});

	it("get() should GET api/generate/lyrics/{id}", async () => {
		const mockResponse = {
			id: "lyrics-1",
			status: "complete",
			title: "Love Song",
			text: "Some lyrics here",
		};
		mockFetch(mockResponse);

		const result = await client.lyrics.get("lyrics-1");

		const [url, options] = getCall();
		expect(url).toContain("api/generate/lyrics/lyrics-1");
		expect(options.method).toBe("GET");
		expect(result).toEqual(mockResponse);
	});

	it("aligned() should GET api/gen/{id}/aligned_lyrics/v2/", async () => {
		const mockResponse = {
			aligned_words: [
				{ word: "Hello", start_s: 0, end_s: 0.5, success: true, p_align: 0.9 },
			],
		};
		mockFetch(mockResponse);

		const result = await client.lyrics.aligned("song-123");

		const [url, options] = getCall();
		expect(url).toContain("api/gen/song-123/aligned_lyrics/v2/");
		expect(options.method).toBe("GET");
		expect(result).toEqual(mockResponse);
	});

	it("should send Authorization header with Bearer token", async () => {
		mockFetch({ id: "x", status: "running", title: "", text: "" });

		await client.lyrics.generate({ prompt: "test" });

		const headers = getCall()[1].headers;
		expect(headers.get("Authorization")).toBe("Bearer test-token");
	});
});
