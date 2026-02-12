/**
 * Adapter registry — maps format names to their adapter implementations.
 */
import type { SupportedFormat, FormatAdapter } from "../types/formats.js";

const registry = new Map<SupportedFormat, FormatAdapter>();

/**
 * Register a format adapter.
 * @param format - The format identifier
 * @param adapter - The adapter implementation
 */
export function registerAdapter(
  format: SupportedFormat,
  adapter: FormatAdapter,
): void {
  registry.set(format, adapter);
}

/**
 * Retrieve a registered adapter.
 * @param format - The format identifier
 * @returns The adapter for the given format
 * @throws Error if the format is not registered
 */
export function getAdapter(format: SupportedFormat): FormatAdapter {
  const adapter = registry.get(format);
  if (!adapter) {
    throw new Error(`No adapter registered for format: "${format}"`);
  }
  return adapter;
}
