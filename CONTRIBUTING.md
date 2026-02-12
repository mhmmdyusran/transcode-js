# Contributing to format-transformer

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/format-transformer.git
cd format-transformer
```

2. **Install dependencies**

```bash
npm install
```

3. **Run type checking**

```bash
npm run typecheck
```

4. **Run tests**

```bash
npm test
```

5. **Build**

```bash
npm run build
```

## Project Structure

```
src/
  core/
    transform.ts     # Main transform engine
    registry.ts      # Adapter registry
  formats/
    json.ts          # One file per format adapter
    yaml.ts
    xml.ts
    ...
  types/
    formats.ts       # Type definitions
  index.ts           # Public API entry point
tests/
  transform.test.ts  # Unit tests
```

## Adding a New Format Adapter

1. **Create the adapter file** at `src/formats/<format-name>.ts`:

```typescript
import type { FormatAdapter } from "../types/formats.js";

export const myFormatAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    // Parse string/Buffer input to a JS object
    if (typeof input === "string") {
      // ... parse logic
    }
    if (Buffer.isBuffer(input)) {
      // ... parse Buffer
    }
    return input;
  },

  stringify(data: unknown): string {
    // Convert JS object to format string
    // Return Buffer instead of string for binary formats
    return "...";
  },
};
```

2. **Add the format to the type union** in `src/types/formats.ts`:

```typescript
export type SupportedFormat =
  | "json"
  // ... existing formats
  | "my-format"; // Add here
```

3. **Register the adapter** in `src/index.ts`:

```typescript
import { myFormatAdapter } from "./formats/my-format.js";
registerAdapter("my-format", myFormatAdapter);
```

4. **Add tests** in `tests/transform.test.ts`

5. **Run tests** to verify everything works:

```bash
npm test
```

## Guidelines

### Code Style

- Use TypeScript with strict mode
- All adapters must implement the `FormatAdapter` interface
- Adapters must be **stateless** — no mutable module-level variables
- Wrap third-party libraries cleanly; don't expose internals
- Use ESM imports with `.js` extensions

### Testing

- Test at least one round-trip conversion for new formats
- Test error cases (invalid input)
- Binary formats must return `Buffer`
- All tests use [Vitest](https://vitest.dev/)

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add protobuf format adapter
fix: handle empty CSV input
docs: update supported formats table
test: add ndjson round-trip tests
```

## Pull Request Process

1. Fork the repo and create your branch from `main`
2. Add tests for any new functionality
3. Ensure all tests pass (`npm test`)
4. Ensure type checking passes (`npm run typecheck`)
5. Update documentation if needed (README, JSDoc)
6. Submit your PR with a clear description

## Reporting Issues

When reporting a bug, please include:

- Node.js version
- Input data (minimal reproduction)
- Source and target formats
- Expected vs actual output
- Error stack trace (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
