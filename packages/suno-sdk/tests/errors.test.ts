import { describe, it, expect } from "vitest";
import { SunoError } from "../src/errors";

describe("SunoError", () => {
	it("should create an error with all properties", () => {
		const error = new SunoError("Not Found", 404, "/items/123", {
			code: "NOT_FOUND",
		});

		expect(error.message).toBe("Not Found");
		expect(error.status).toBe(404);
		expect(error.endpoint).toBe("/items/123");
		expect(error.details).toEqual({ code: "NOT_FOUND" });
		expect(error.name).toBe("SunoError");
	});

	it("should serialize to JSON", () => {
		const error = new SunoError("Bad Request", 400, "/items");
		const json = error.toJSON();

		expect(json).toEqual({
			error: "SunoError",
			message: "Bad Request",
			status: 400,
			endpoint: "/items",
			details: undefined,
		});
	});

	it("should be an instance of Error", () => {
		const error = new SunoError("test", 500, "/");
		expect(error).toBeInstanceOf(Error);
	});
});
