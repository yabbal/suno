import { describe, it, expect, vi, beforeEach } from "vitest";
import { SunoClient } from "../src/client";

describe("SongsResource", () => {
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

	it("generate() should POST to api/generate/v2/ with description params", async () => {
		const mockResponse = { clips: [{ id: "clip-1" }] };
		mockFetch(mockResponse);

		const result = await client.songs.generate({
			gpt_description_prompt: "a happy pop song",
		});

		const [url, options] = getCall();
		expect(url).toContain("api/generate/v2/");
		expect(options.method).toBe("POST");
		const body = JSON.parse(options.body);
		expect(body.gpt_description_prompt).toBe("a happy pop song");
		expect(body.generation_type).toBe("TEXT");
		expect(body.mv).toBe("chirp-v4");
		expect(result).toEqual(mockResponse);
	});

	it("generate() should use custom model version when provided", async () => {
		mockFetch({ clips: [] });

		await client.songs.generate({
			gpt_description_prompt: "test",
			mv: "chirp-v3-5",
		});

		const body = JSON.parse(getCall()[1].body);
		expect(body.mv).toBe("chirp-v3-5");
	});

	it("generateCustom() should POST with lyrics, tags, and title", async () => {
		const mockResponse = { clips: [{ id: "clip-2" }] };
		mockFetch(mockResponse);

		const result = await client.songs.generateCustom({
			prompt: "Verse 1\nHello world",
			tags: "pop rock",
			title: "My Song",
		});

		const [url, options] = getCall();
		expect(url).toContain("api/generate/v2/");
		expect(options.method).toBe("POST");
		const body = JSON.parse(options.body);
		expect(body.prompt).toBe("Verse 1\nHello world");
		expect(body.tags).toBe("pop rock");
		expect(body.title).toBe("My Song");
		expect(body.generation_type).toBe("TEXT");
		expect(body.mv).toBe("chirp-v4");
		expect(result).toEqual(mockResponse);
	});

	it("extend() should POST with task:extend", async () => {
		const mockResponse = { clips: [{ id: "clip-3" }] };
		mockFetch(mockResponse);

		const result = await client.songs.extend({
			continue_clip_id: "original-id",
			continue_at: 120,
		});

		const [url, options] = getCall();
		expect(url).toContain("api/generate/v2/");
		expect(options.method).toBe("POST");
		const body = JSON.parse(options.body);
		expect(body.task).toBe("extend");
		expect(body.continue_clip_id).toBe("original-id");
		expect(body.continue_at).toBe(120);
		expect(body.generation_type).toBe("TEXT");
		expect(result).toEqual(mockResponse);
	});

	it("concat() should POST to api/generate/concat/v2/", async () => {
		const mockResponse = { clips: [{ id: "clip-4" }] };
		mockFetch(mockResponse);

		const result = await client.songs.concat({ clip_id: "clip-to-concat" });

		const [url, options] = getCall();
		expect(url).toContain("api/generate/concat/v2/");
		expect(options.method).toBe("POST");
		const body = JSON.parse(options.body);
		expect(body.clip_id).toBe("clip-to-concat");
		expect(result).toEqual(mockResponse);
	});

	it("list() should GET api/feed/v2 with query params", async () => {
		const mockResponse = { clips: [{ id: "clip-5" }] };
		mockFetch(mockResponse);

		const result = await client.songs.list({ page: 2, ids: "a,b,c" });

		const [url, options] = getCall();
		expect(url).toContain("api/feed/v2");
		expect(url).toContain("page=2");
		expect(url).toContain("ids=a%2Cb%2Cc");
		expect(options.method).toBe("GET");
		expect(result).toEqual(mockResponse);
	});

	it("list() should work without params", async () => {
		mockFetch({ clips: [] });

		await client.songs.list();

		const [url] = getCall();
		expect(url).toContain("api/feed/v2");
	});

	it("get() should GET api/clip/{id}", async () => {
		const mockClip = { id: "my-clip", title: "Test" };
		mockFetch(mockClip);

		const result = await client.songs.get("my-clip");

		const [url, options] = getCall();
		expect(url).toContain("api/clip/my-clip");
		expect(options.method).toBe("GET");
		expect(result).toEqual(mockClip);
	});

	it("setVisibility() should POST with is_public", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(null, { status: 204 }),
		);

		await client.songs.setVisibility("clip-id", { is_public: true });

		const [url, options] = getCall();
		expect(url).toContain("api/gen/clip-id/set_visibility/");
		expect(options.method).toBe("POST");
		const body = JSON.parse(options.body);
		expect(body.is_public).toBe(true);
	});

	it("should send Authorization header with Bearer token", async () => {
		mockFetch({ clips: [] });

		await client.songs.list();

		const headers = getCall()[1].headers;
		expect(headers.get("Authorization")).toBe("Bearer test-token");
	});
});
