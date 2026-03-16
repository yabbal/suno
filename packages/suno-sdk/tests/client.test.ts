import { describe, it, expect, vi, beforeEach } from "vitest";
import { SunoClient } from "../src/client";

describe("SunoClient", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should create a client with options", () => {
		const client = new SunoClient({ cookie: "test-token" });
		expect(client).toBeDefined();
		expect(client.fetch).toBeDefined();
	});

	it("should expose all resource accessors", () => {
		const client = new SunoClient({ cookie: "test-token" });
		expect(client.songs).toBeDefined();
		expect(client.lyrics).toBeDefined();
		expect(client.billing).toBeDefined();
		expect(client.stems).toBeDefined();
		expect(client.personas).toBeDefined();
	});

	it("should set authorization header", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ clips: [] }), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);

		const client = new SunoClient({ cookie: "my-secret-key" });
		await client.songs.list();

		const call = (globalThis.fetch as any).mock.calls[0];
		const headers = call[1].headers;
		expect(headers.get("Authorization")).toBe("Bearer my-secret-key");
	});
});
