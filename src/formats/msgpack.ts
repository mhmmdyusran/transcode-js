/**
 * MessagePack adapter — uses msgpackr. Returns Buffer.
 */
import type { FormatAdapter } from "../types/formats.js";
import { pack, unpack } from "msgpackr";

export const msgpackAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (Buffer.isBuffer(input)) {
      return unpack(input) as unknown;
    }
    if (input instanceof Uint8Array) {
      return unpack(Buffer.from(input)) as unknown;
    }
    if (typeof input === "object" && input !== null) {
      return input;
    }
    if (typeof input === "string") {
      return JSON.parse(input);
    }
    throw new Error(
      "MsgPack parse requires Buffer, Uint8Array, or object input",
    );
  },

  stringify(data: unknown): Buffer {
    const packed = pack(data);
    return Buffer.from(packed.buffer, packed.byteOffset, packed.byteLength);
  },
};
