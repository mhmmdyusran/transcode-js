/**
 * Transform engine — the single entry point for format conversion.
 */
import type { TransformInput } from "../types/formats.js";
import { getAdapter } from "./registry.js";

/**
 * Transform data from one format to another.
 *
 * @param input - The transform input containing `from`, `to`, and `input`
 * @returns The converted data as a string or Buffer (for binary formats)
 */
export function transform(params: TransformInput): string | Buffer {
  const { from, to, input } = params;

  // Short-circuit: if source and target formats are identical, return input as-is
  if (from === to) {
    if (typeof input === "string" || Buffer.isBuffer(input)) {
      return input;
    }
    // If input is an object, stringify it with the target adapter
    const adapter = getAdapter(to);
    return adapter.stringify(input);
  }

  const sourceAdapter = getAdapter(from);
  const targetAdapter = getAdapter(to);

  // Parse input to intermediate JS object
  const intermediate = sourceAdapter.parse(input);

  // Stringify intermediate object to target format
  return targetAdapter.stringify(intermediate);
}
