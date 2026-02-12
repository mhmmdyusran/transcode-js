/**
 * URL-encoded adapter — uses qs library.
 * Handles both 'urlencoded' and 'formdata' format identifiers.
 */
import type { FormatAdapter } from "../types/formats.js";
import qs from "qs";

export const urlencodedAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string") {
      return qs.parse(input);
    }
    if (Buffer.isBuffer(input)) {
      return qs.parse(input.toString("utf-8"));
    }
    return input;
  },

  stringify(data: unknown): string {
    return qs.stringify(data as Record<string, unknown>);
  },
};
