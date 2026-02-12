/**
 * ENV / dotenv adapter — robust manual implementation (fallback as dotenv failed install).
 */
import type { FormatAdapter } from "../types/formats.js";

function parseEnv(src: string): Record<string, string> {
  const obj: Record<string, string> = {};
  // Convert line breaks to \n
  const lines = src.toString().split(/\n|\r|\r\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    // Ignore comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    // Match KEY=VAL
    const match = trimmed.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";

      // Handle quotes (simple double/single quotes)
      // Expand \n inside quoted values
      const quoteMatch = value.match(/^(['"])(.*)\1$/);
      if (quoteMatch) {
        value = quoteMatch[2];
        value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
      } else {
        value = value.trim();
      }

      obj[key] = value;
    }
  }

  return obj;
}

export const envAdapter: FormatAdapter = {
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

    return parseEnv(text);
  },

  stringify(data: unknown): string {
    if (typeof data !== "object" || data === null) {
      throw new Error("ENV format requires an object input");
    }

    const entries = Object.entries(data as Record<string, unknown>);
    return entries
      .map(([key, value]) => {
        const strVal = String(value);
        // Add quotes if value contains spaces, newlines, or equals
        const needsQuotes =
          strVal.includes(" ") || strVal.includes("=") || strVal.includes("\n");
        return `${key}=${needsQuotes ? `"${strVal.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"` : strVal}`;
      })
      .join("\n");
  },
};
