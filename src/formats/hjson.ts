/**
 * HJSON adapter — uses hjson library.
 */
import type { FormatAdapter } from "../types/formats.js";
import Hjson from "hjson";

export const hjsonAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string") {
      return Hjson.parse(input);
    }
    if (Buffer.isBuffer(input)) {
      return Hjson.parse(input.toString("utf-8"));
    }
    return input;
  },

  stringify(data: unknown): string {
    return Hjson.stringify(data as Record<string, unknown>, { space: 2 });
  },
};
