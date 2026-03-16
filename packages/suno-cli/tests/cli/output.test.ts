import { describe, it, expect, vi, beforeEach } from "vitest";
import { output } from "../../src/cli/output";

describe("output", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should output JSON by default", () => {
		const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		output({ id: "1", name: "test" });

		const written = spy.mock.calls[0][0] as string;
		expect(JSON.parse(written)).toEqual({ id: "1", name: "test" });
	});

	it("should output JSON when format is json", () => {
		const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		output([{ id: "1" }], { format: "json" });

		const written = spy.mock.calls[0][0] as string;
		expect(JSON.parse(written)).toEqual([{ id: "1" }]);
	});

	it("should output table format", () => {
		const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		output([{ id: "1", name: "test" }], { format: "table" });

		const written = spy.mock.calls[0][0] as string;
		expect(written).toContain("id");
		expect(written).toContain("name");
		expect(written).toContain("test");
	});

	it("should output CSV format", () => {
		const spy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		output([{ id: "1", name: "test" }], { format: "csv" });

		const written = spy.mock.calls[0][0] as string;
		expect(written).toContain("id,name");
		expect(written).toContain("1,test");
	});
});
