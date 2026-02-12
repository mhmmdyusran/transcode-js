/**
 * JSON adapter — uses built-in JSON.
 */
import type { FormatAdapter } from "../types/formats.js";

export const jsonAdapter: FormatAdapter = {
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
