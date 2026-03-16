import { describe, it, expect, vi, beforeEach } from "vitest";
import { createFetch } from "../src/fetch";

describe("createFetch", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should make a GET request", async () => {
		const mockResponse = { id: "1", name: "test" };
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify(mockResponse), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);

		const fetchFn = createFetch({ baseURL: "https://api.example.com" });
		const result = await fetchFn("items");

		expect(result).toEqual(mockResponse);
		expect(globalThis.fetch).toHaveBeenCalledOnce();
	});

	it("should build URL with query params", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify([]), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);

		const fetchFn = createFetch({ baseURL: "https://api.example.com" });
		await fetchFn("items", { query: { limit: 10, offset: 0 } });

		const calledUrl = (globalThis.fetch as any).mock.calls[0][0];
		expect(calledUrl).toContain("limit=10");
		expect(calledUrl).toContain("offset=0");
	});

	it("should retry on retryable status codes", async () => {
		vi.spyOn(globalThis, "fetch")
			.mockResolvedValueOnce(new Response(null, { status: 503 }))
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ ok: true }), {
					status: 200,
					headers: { "content-type": "application/json" },
				}),
			);

		const fetchFn = createFetch({
			baseURL: "https://api.example.com",
			retry: 1,
			retryDelay: 0,
			retryStatusCodes: [503],
		});

		const result = await fetchFn("items");
		expect(result).toEqual({ ok: true });
		expect(globalThis.fetch).toHaveBeenCalledTimes(2);
	});

	it("should call onRequest hook", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(null, { status: 204 }),
		);

		const onRequest = vi.fn();
		const fetchFn = createFetch({
			baseURL: "https://api.example.com",
			onRequest,
		});

		await fetchFn("items");
		expect(onRequest).toHaveBeenCalledOnce();
	});

	it("should call onResponseError for non-ok responses", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ error: "not found" }), {
				status: 404,
				statusText: "Not Found",
				headers: { "content-type": "application/json" },
			}),
		);

		const onResponseError = vi.fn();
		const fetchFn = createFetch({
			baseURL: "https://api.example.com",
			onResponseError,
		});

		await fetchFn("items/999").catch(() => {});
		expect(onResponseError).toHaveBeenCalledOnce();
	});

	it("should send JSON body for POST", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ id: "1" }), {
				status: 201,
				headers: { "content-type": "application/json" },
			}),
		);

		const fetchFn = createFetch({ baseURL: "https://api.example.com" });
		await fetchFn("items", { method: "POST", body: { name: "test" } });

		const call = (globalThis.fetch as any).mock.calls[0];
		expect(call[1].method).toBe("POST");
		expect(call[1].body).toBe('{"name":"test"}');
	});
});
