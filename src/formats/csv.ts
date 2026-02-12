/**
 * CSV adapter — uses csv-parse and csv-stringify (sync versions).
 */
import type { FormatAdapter } from "../types/formats.js";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export const csvAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string" || Buffer.isBuffer(input)) {
      const text =
        typeof input === "string" ? input : input.toString("utf-8");
      return parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as unknown;
    }
    return input;
  },

  stringify(data: unknown): string {
    if (!Array.isArray(data)) {
      throw new Error("CSV format requires an array of objects as input");
    }

    if (data.length === 0) {
      return "";
    }

    return stringify(data, {
      header: true,
    });
  },
};
