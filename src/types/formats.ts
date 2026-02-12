/**
 * Type definitions for format-transformer
 */

/** All supported format identifiers */
export type SupportedFormat =
  | "json"
  | "json5"
  | "hjson"
  | "ndjson"
  | "yaml"
  | "yml"
  | "xml"
  | "html"
  | "toml"
  | "ini"
  | "properties"
  | "env"
  | "dotenv"
  | "editorconfig"
  | "csv"
  | "tsv"
  | "urlencoded"
  | "formdata"
  | "bson"
  | "msgpack"
  | "cbor"
  | "geojson"
  | "graphql-json"
  | "openapi-json"
  | "swagger-json"
  | "har"
  | "postman-collection";

/** Formats that return Buffer instead of string */
export type BinaryFormat = "bson" | "msgpack" | "cbor";

/** Interface every format adapter must implement */
export interface FormatAdapter {
  parse(input: unknown): unknown;
  stringify(data: unknown): string | Buffer;
}

/** Input shape for the transform function */
export interface TransformInput {
  from: SupportedFormat;
  to: SupportedFormat;
  input: unknown;
}

/** Conditional return type: Buffer for binary formats, string otherwise */
export type TransformResult<T extends SupportedFormat> = T extends BinaryFormat
  ? Buffer
  : string;
