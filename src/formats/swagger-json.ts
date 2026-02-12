/**
 * Swagger JSON adapter — JSON wrapper for Swagger specification documents.
 */
import type { FormatAdapter } from "../types/formats.js";

export const swaggerJsonAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string") {
      return JSON.parse(input);
    }
    if (Buffer.isBuffer(input)) {
      return JSON.parse(input.toString("utf-8"));
    }
    return input;
  },

  stringify(data: unknown): string {
    return JSON.stringify(data, null, 2);
  },
};
