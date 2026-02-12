/**
 * BSON adapter — uses bson library. Returns Buffer.
 */
import type { FormatAdapter } from "../types/formats.js";
import { serialize, deserialize } from "bson";

export const bsonAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (Buffer.isBuffer(input)) {
      return deserialize(input);
    }
    if (input instanceof Uint8Array) {
      return deserialize(Buffer.from(input));
    }
    // If it's already an object, return as-is
    if (typeof input === "object" && input !== null) {
      return input;
    }
    // If string, try to parse as JSON first (for pipeline usage)
    if (typeof input === "string") {
      return JSON.parse(input);
    }
    throw new Error("BSON parse requires Buffer, Uint8Array, or object input");
  },

  stringify(data: unknown): Buffer {
    if (typeof data !== "object" || data === null) {
      throw new Error("BSON serialize requires an object input");
    }
    const bytes = serialize(data as Record<string, unknown>);
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  },
};
