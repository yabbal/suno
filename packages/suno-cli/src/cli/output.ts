import Table from "cli-table3";
import { SunoError } from "suno-sdk";

export type OutputFormat = "json" | "table" | "csv";

export const formatArg = {
	format: {
		type: "string" as const,
		description: "Output format (json, table, csv)",
		default: "json",
	},
};

export interface TableColumn {
	key: string;
	header?: string;
	get?: (row: Record<string, unknown>) => unknown;
}

interface OutputOptions {
	format?: OutputFormat;
	columns?: TableColumn[];
}

const stringifyValue = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
};

const displayValue = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	if (Array.isArray(value)) {
		if (value.length === 0) return "";
		return `(${value.length})`;
	}
	if (typeof value === "object" && value !== null) {
		const obj = value as Record<string, unknown>;
		if (obj.name !== undefined) return String(obj.name);
		if (obj.label !== undefined) return String(obj.label);
		if (obj.id !== undefined) return `#${obj.id}`;
		return JSON.stringify(obj);
	}
	return String(value);
};

const outputJson = (data: unknown): void => {
	process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
};

const outputTable = (data: unknown, columns?: TableColumn[]): void => {
	if (
		Array.isArray(data) &&
		data.length > 0 &&
		typeof data[0] === "object" &&
		data[0] !== null
	) {
		const cols: TableColumn[] =
			columns ??
			Object.keys(data[0] as Record<string, unknown>).map((k) => ({
				key: k,
			}));
		const headers = cols.map((c) => c.header ?? c.key);
		const table = new Table({ head: headers });
		for (const row of data) {
			const record = row as Record<string, unknown>;
			table.push(
				cols.map((col) => {
					const val = col.get ? col.get(record) : record[col.key];
					return displayValue(val);
				}),
			);
		}
		process.stdout.write(`${table.toString()}\n`);
	} else if (
		typeof data === "object" &&
		data !== null &&
		!Array.isArray(data)
	) {
		const table = new Table();
		for (const [key, value] of Object.entries(
			data as Record<string, unknown>,
		)) {
			table.push({ [key]: displayValue(value) });
		}
		process.stdout.write(`${table.toString()}\n`);
	} else {
		outputJson(data);
	}
};

const escapeCsvField = (value: string): string => {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
};

const outputCsv = (data: unknown): void => {
	if (
		Array.isArray(data) &&
		data.length > 0 &&
		typeof data[0] === "object" &&
		data[0] !== null
	) {
		const keys = Object.keys(data[0] as Record<string, unknown>);
		const header = keys.map(escapeCsvField).join(",");
		const lines = data.map((row) => {
			const record = row as Record<string, unknown>;
			return keys
				.map((key) => escapeCsvField(stringifyValue(record[key])))
				.join(",");
		});
		process.stdout.write(`${header}\n${lines.join("\n")}\n`);
	} else {
		outputJson(data);
	}
};

export const output = (data: unknown, options?: OutputOptions): void => {
	const format = options?.format ?? "json";

	if (!["json", "table", "csv"].includes(format)) {
		process.stderr.write(
			`${JSON.stringify({ error: `Invalid format: "${format}". Use json, table or csv.` })}\n`,
		);
		process.exit(1);
	}

	switch (format) {
		case "table":
			outputTable(data, options?.columns);
			break;
		case "csv":
			outputCsv(data);
			break;
		default:
			outputJson(data);
			break;
	}
};

export const outputError = (error: unknown): void => {
	if (error instanceof SunoError) {
		process.stderr.write(`${JSON.stringify(error.toJSON())}\n`);
	} else {
		const message = error instanceof Error ? error.message : String(error);
		process.stderr.write(`${JSON.stringify({ error: message })}\n`);
	}
	process.exit(1);
};
