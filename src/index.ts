/**
 * format-transformer — Production-grade stateless format conversion library.
 *
 * @example
 * ```typescript
 * import { convert } from "format-transformer";
 *
 * const result = convert.transform({
 *   from: "yaml",
 *   to: "xml",
 *   input: "name: Yusran"
 * });
 * ```
 */

// Register all adapters
import { registerAdapter } from "./core/registry.js";
import { transform } from "./core/transform.js";

// Format adapters
import { jsonAdapter } from "./formats/json.js";
import { json5Adapter } from "./formats/json5.js";
import { hjsonAdapter } from "./formats/hjson.js";
import { ndjsonAdapter } from "./formats/ndjson.js";
import { yamlAdapter } from "./formats/yaml.js";
import { xmlAdapter } from "./formats/xml.js";
import { htmlAdapter } from "./formats/html.js";
import { tomlAdapter } from "./formats/toml.js";
import { iniAdapter } from "./formats/ini.js";
import { propertiesAdapter } from "./formats/properties.js";
import { envAdapter } from "./formats/env.js";
import { editorconfigAdapter } from "./formats/editorconfig.js";
import { csvAdapter } from "./formats/csv.js";
import { tsvAdapter } from "./formats/tsv.js";
import { urlencodedAdapter } from "./formats/urlencoded.js";
import { bsonAdapter } from "./formats/bson.js";
import { msgpackAdapter } from "./formats/msgpack.js";
import { cborAdapter } from "./formats/cbor.js";
import { geojsonAdapter } from "./formats/geojson.js";
import { graphqlJsonAdapter } from "./formats/graphql-json.js";
import { openapiJsonAdapter } from "./formats/openapi-json.js";
import { swaggerJsonAdapter } from "./formats/swagger-json.js";
import { harAdapter } from "./formats/har.js";
import { postmanCollectionAdapter } from "./formats/postman-collection.js";

// ── Register all adapters ──────────────────────────────────────────────

// JSON & Variants
registerAdapter("json", jsonAdapter);
registerAdapter("json5", json5Adapter);
registerAdapter("hjson", hjsonAdapter);
registerAdapter("ndjson", ndjsonAdapter);

// YAML & Variants
registerAdapter("yaml", yamlAdapter);
registerAdapter("yml", yamlAdapter);

// XML & Markup
registerAdapter("xml", xmlAdapter);
registerAdapter("html", htmlAdapter);

// Config Formats
registerAdapter("toml", tomlAdapter);
registerAdapter("ini", iniAdapter);
registerAdapter("properties", propertiesAdapter);
registerAdapter("env", envAdapter);
registerAdapter("dotenv", envAdapter);
registerAdapter("editorconfig", editorconfigAdapter);

// Tabular Formats
registerAdapter("csv", csvAdapter);
registerAdapter("tsv", tsvAdapter);

// URL / Web Encoding
registerAdapter("urlencoded", urlencodedAdapter);
registerAdapter("formdata", urlencodedAdapter);

// Binary Formats
registerAdapter("bson", bsonAdapter);
registerAdapter("msgpack", msgpackAdapter);
registerAdapter("cbor", cborAdapter);

// Enterprise / Structured Data
registerAdapter("geojson", geojsonAdapter);
registerAdapter("graphql-json", graphqlJsonAdapter);
registerAdapter("openapi-json", openapiJsonAdapter);
registerAdapter("swagger-json", swaggerJsonAdapter);
registerAdapter("har", harAdapter);
registerAdapter("postman-collection", postmanCollectionAdapter);

// ── Public API ─────────────────────────────────────────────────────────

/**
 * The main convert object. Use `convert.transform()` to convert between formats.
 */
export const convert = {
  transform,
} as const;

// Re-export types
export type {
  SupportedFormat,
  BinaryFormat,
  FormatAdapter,
  TransformInput,
  TransformResult,
} from "./types/formats.js";
