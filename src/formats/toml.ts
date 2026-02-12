/**
 * TOML adapter — uses @iarna/toml.
 */
import type { FormatAdapter } from "../types/formats.js";
import TOML from "@iarna/toml";

export const tomlAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string") {
      return TOML.parse(input);
    }
    if (Buffer.isBuffer(input)) {
      return TOML.parse(input.toString("utf-8"));
    }
    return input;
  },

  stringify(data: unknown): string {
    return TOML.stringify(data as TOML.JsonMap);
  },
};
