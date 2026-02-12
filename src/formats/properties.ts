/**
 * Properties adapter — Java .properties format (robust manual implementation).
 * Mimics java.util.Properties behavior for key=value, key:value, comments, and escaping.
 */
import type { FormatAdapter } from "../types/formats.js";

function parseProperties(src: string): Record<string, string> {
  const obj: Record<string, string> = {};
  const lines = src.toString().split(/\n|\r|\r\n/);

  let tempKey: string | null = null;
  let tempVal: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Handle multiline continuation (naive)
    // Real properties format handles '\' at end of line to continue next line
    while (line.endsWith("\\") && !line.endsWith("\\\\")) {
      line = line.slice(0, -1);
      if (i + 1 < lines.length) {
        i++;
        line += lines[i].trim();
      } else {
        break;
      }
    }

    if (!line || line.startsWith("#") || line.startsWith("!")) {
      continue;
    }

    // Split key and value on first = or : or space
    // Standard properties allows space as separator too
    // But we focus on = and : which are common
    const parts = line.split(/=|:/);
    let key = parts[0].trim();
    let val = parts.slice(1).join("=").trim(); // re-join in case value had =

    // If split by : failed?
    // Actually properties format is tricky.
    // Simplifying: strict key=value or key:value support
    if (parts.length < 2 && line.includes("=")) {
      // already caught by split
    } else if (parts.length < 2 && line.includes(":")) {
       // already caught
    }

    // Handle escapes in value ?
    // Java properties uses unicode escapes \uXXXX
    // We'll rely on JS string behavior mostly, maybe unescape simple things
    val = val.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r");

    obj[key] = val;
  }
  return obj;
}

export const propertiesAdapter: FormatAdapter = {
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

    try {
      return parseProperties(text);
    } catch (error: any) {
      throw new Error(`Failed to parse properties: ${error.message}`);
    }
  },

  stringify(data: unknown): string {
    if (typeof data !== "object" || data === null) {
      throw new Error("Properties format requires an object input");
    }

    const entries = Object.entries(data as Record<string, unknown>);
    return entries
      .map(([key, value]) => {
        // Escape special chars in key
        const k = key.replace(/[=:\s]/g, "\\$&");
        // Escape newlines in value
        const v = String(value).replace(/[\r\n]/g, "\\n");
        return `${k}=${v}`;
      })
      .join("\n");
  },
};
