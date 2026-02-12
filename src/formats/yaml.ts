/**
 * YAML adapter — uses yaml library.
 * Handles both 'yaml' and 'yml' format identifiers.
 */
import type { FormatAdapter } from "../types/formats.js";
import YAML from "yaml";

export const yamlAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string") {
      return YAML.parse(input);
    }
    if (Buffer.isBuffer(input)) {
      return YAML.parse(input.toString("utf-8"));
    }
    return input;
  },

  stringify(data: unknown): string {
    return YAML.stringify(data);
  },
};
