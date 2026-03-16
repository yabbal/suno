import { describe, it, expect, vi } from "vitest";

describe("version command", () => {
	it("should output version and node info", async () => {
		const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		// Simulate __VERSION__ global
		vi.stubGlobal("__VERSION__", "0.1.0");

		const { versionCommand } = await import(
			"../../src/cli/commands/version"
		);
		await (versionCommand as any).run?.();

		const written = spy.mock.calls[0][0] as string;
		const parsed = JSON.parse(written);
		expect(parsed.version).toBe("0.1.0");
		expect(parsed.node).toBeDefined();

		vi.unstubAllGlobals();
	});
});
