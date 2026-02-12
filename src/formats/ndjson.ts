/**
 * NDJSON adapter — newline-delimited JSON.
 */
import type { FormatAdapter } from "../types/formats.js";

export const ndjsonAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    const text =
      typeof input === "string"
        ? input
        : Buffer.isBuffer(input)
          ? input.toString("utf-8")
          : "";

    if (typeof input !== "string" && !Buffer.isBuffer(input)) {
      return input;
    }

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((line) => JSON.parse(line));
  },

  stringify(data: unknown): string {
    if (!Array.isArray(data)) {
      return JSON.stringify(data);
    }
    return data.map((item) => JSON.stringify(item)).join("\n");
  },
};
