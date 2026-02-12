/**
 * CBOR adapter — uses cbor library. Returns Buffer.
 */
import type { FormatAdapter } from "../types/formats.js";
import cbor from "cbor";

export const cborAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (Buffer.isBuffer(input)) {
      return cbor.decodeFirstSync(input) as unknown;
    }
    if (input instanceof Uint8Array) {
      return cbor.decodeFirstSync(Buffer.from(input)) as unknown;
    }
    if (typeof input === "object" && input !== null) {
      return input;
    }
    if (typeof input === "string") {
      return JSON.parse(input);
    }
    throw new Error("CBOR parse requires Buffer, Uint8Array, or object input");
  },

  stringify(data: unknown): Buffer {
    return cbor.encodeOne(data) as Buffer;
  },
};
