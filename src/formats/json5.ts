/**
 * JSON5 adapter — uses json5 library.
 */
import type { FormatAdapter } from "../types/formats.js";
import JSON5 from "json5";

export const json5Adapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string") {
      return JSON5.parse(input);
    }
    if (Buffer.isBuffer(input)) {
      return JSON5.parse(input.toString("utf-8"));
    }
    return input;
  },

  stringify(data: unknown): string {
    return JSON5.stringify(data, null, 2);
  },
};
