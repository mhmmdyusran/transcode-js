/**
 * INI adapter — uses ini library.
 */
import type { FormatAdapter } from "../types/formats.js";
import ini from "ini";

export const iniAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string") {
      return ini.parse(input);
    }
    if (Buffer.isBuffer(input)) {
      return ini.parse(input.toString("utf-8"));
    }
    return input;
  },

  stringify(data: unknown): string {
    return ini.stringify(data as Record<string, unknown>);
  },
};
