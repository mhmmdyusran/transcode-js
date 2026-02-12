/**
 * EditorConfig adapter — parses .editorconfig format (INI-like with sections).
 */
import type { FormatAdapter } from "../types/formats.js";

export const editorconfigAdapter: FormatAdapter = {
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

    const result: Record<string, unknown> = {};
    let currentSection = "__global__";
    const lines = text.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";")) {
        continue;
      }

      const sectionMatch = trimmed.match(/^\[(.+)\]$/);
      if (sectionMatch) {
        currentSection = sectionMatch[1];
        if (!result[currentSection]) {
          result[currentSection] = {};
        }
        continue;
      }

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();

      if (currentSection === "__global__") {
        result[key] = value;
      } else {
        (result[currentSection] as Record<string, string>)[key] = value;
      }
    }

    return result;
  },

  stringify(data: unknown): string {
    if (typeof data !== "object" || data === null) {
      throw new Error("EditorConfig format requires an object input");
    }

    const obj = data as Record<string, unknown>;
    const lines: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        lines.push(`[${key}]`);
        for (const [subKey, subValue] of Object.entries(
          value as Record<string, unknown>,
        )) {
          lines.push(`${subKey} = ${String(subValue)}`);
        }
        lines.push("");
      } else {
        lines.push(`${key} = ${String(value)}`);
      }
    }

    return lines.join("\n");
  },
};
