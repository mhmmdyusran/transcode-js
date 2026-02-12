<h1 align="center">transcode-js</h1>

> Production-grade, stateless, in-memory format conversion library for Node.js.

<p align="center">

  <a href="https://www.npmjs.com/package/transcode-js">
    <img src="https://img.shields.io/npm/v/transcode-js?style=flat-square" alt="NPM Version" />
  </a>

  <a href="https://github.com/mhmmdyusran/transcode-js/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/mhmmdyusran/transcode-js/ci.yml?branch=main&style=flat-square" alt="Build Status" />
  </a>

  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT License" />
  </a>

  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  </a>

  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=nodedotjs" alt="Node.js 18+" />
  </a>

</p>

Transform data between **27+ formats** — including JSON, YAML, XML, TOML, CSV, BSON, MsgPack, CBOR, and many more — with a single function call. No CLI, no options, no streaming, no global state. Just pure transformation.

## Install

```bash
npm install transcode-js
```

> **Requires Node.js 18+**

## Quick Start

```typescript
import { convert } from "transcode-js";

// YAML → XML
const xml = convert.transform({
  from: "yaml",
  to: "xml",
  input: "name: Yusran\nage: 25",
});

// JSON → BSON (returns Buffer)
const bson = convert.transform({
  from: "json",
  to: "bson",
  input: '{"name": "Yusran"}',
});

// CSV → JSON
const json = convert.transform({
  from: "csv",
  to: "json",
  input: "name,age\nYusran,25\nAli,30",
});

// ENV → YAML
const yaml = convert.transform({
  from: "env",
  to: "yaml",
  input: "DB_HOST=localhost\nDB_PORT=5432",
});
```

## API

### `convert.transform({ from, to, input })`

| Parameter | Type              | Description                            |
| --------- | ----------------- | -------------------------------------- |
| `from`    | `SupportedFormat` | Source format                          |
| `to`      | `SupportedFormat` | Target format                          |
| `input`   | `unknown`         | Input data (string, Buffer, or object) |

**Returns:** `string` or `Buffer` (see [Return Type](#return-type))

No additional parameters. No options. No chaining. No state.

## Supported Formats

| Category            | Formats                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| **JSON & Variants** | `json`, `json5`, `hjson`, `ndjson`                                                     |
| **YAML**            | `yaml`, `yml`                                                                          |
| **XML & Markup**    | `xml`, `html`                                                                          |
| **Config**          | `toml`, `ini`, `properties`, `env`, `dotenv`, `editorconfig`                           |
| **Tabular**         | `csv`, `tsv`                                                                           |
| **URL/Web**         | `urlencoded`, `formdata`                                                               |
| **Binary**          | `bson`, `msgpack`, `cbor`                                                              |
| **Enterprise**      | `geojson`, `graphql-json`, `openapi-json`, `swagger-json`, `har`, `postman-collection` |

## Return Type

| Target Format             | Return Type |
| ------------------------- | ----------- |
| `bson`, `msgpack`, `cbor` | `Buffer`    |
| Everything else           | `string`    |

```typescript
// Returns string
const yaml: string = convert.transform({ from: "json", to: "yaml", input: data });

// Returns Buffer
const bson: Buffer = convert.transform({ from: "json", to: "bson", input: data });
```

## Architecture

```
input → registry[from].parse() → intermediate JS object → registry[to].stringify() → output
```

Each format has its own **isolated adapter** implementing:

```typescript
interface FormatAdapter {
  parse(input: unknown): unknown;
  stringify(data: unknown): string | Buffer;
}
```

## ⚠️ Lossy Conversion Warning

Format conversions can be **lossy** depending on the source and target formats:

- **XML → JSON**: Attributes, comments, and processing instructions may lose structural context
- **JSON → CSV**: Nested objects and arrays will be flattened or stringified
- **INI/ENV → JSON**: All values become strings (no type preservation)
- **Binary → Text**: Round-trip through binary formats (BSON, MsgPack, CBOR) is generally safe for JSON-compatible data
- **NDJSON ↔ JSON**: NDJSON always produces/expects arrays
- **HTML → other**: HTML-specific constructs (void elements, entities) may not map cleanly

Always validate output when converting between structurally different formats.

## TypeScript

Full type support included:

```typescript
import type { SupportedFormat, FormatAdapter, TransformInput } from "transcode-js";
```

## License

MIT
