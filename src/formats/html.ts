/**
 * HTML adapter — uses fast-xml-parser in html mode.
 */
import type { FormatAdapter } from "../types/formats.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: true,
  htmlEntities: true,
  unpairedTags: [
    "br",
    "hr",
    "img",
    "input",
    "meta",
    "link",
    "area",
    "base",
    "col",
    "embed",
    "source",
    "track",
    "wbr",
  ],
};

const builderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  indentBy: "  ",
  suppressEmptyNode: false,
  unpairedTags: [
    "br",
    "hr",
    "img",
    "input",
    "meta",
    "link",
    "area",
    "base",
    "col",
    "embed",
    "source",
    "track",
    "wbr",
  ],
};

export const htmlAdapter: FormatAdapter = {
  parse(input: unknown): unknown {
    if (typeof input === "string" || Buffer.isBuffer(input)) {
      const text =
        typeof input === "string" ? input : input.toString("utf-8");
      const parser = new XMLParser(parserOptions);
      return parser.parse(text) as unknown;
    }
    return input;
  },

  stringify(data: unknown): string {
    const builder = new XMLBuilder(builderOptions);
    return builder.build(data) as string;
  },
};
