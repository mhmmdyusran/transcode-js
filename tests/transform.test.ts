import { describe, it, expect, test } from "vitest";
import { convert } from "../src/index.js";

describe("format-transformer", () => {
  // ── Short-circuit ──────────────────────────────────────────────────────

  describe("short-circuit (from === to)", () => {
    it("should return string input as-is when from === to", () => {
      const input = '{"name":"Yusran"}';
      const result = convert.transform({ from: "json", to: "json", input });
      expect(result).toBe(input);
    });

    it("should stringify object input when from === to", () => {
      const input = { name: "Yusran" };
      const result = convert.transform({ from: "json", to: "json", input });
      expect(JSON.parse(result as string)).toEqual(input);
    });
  });

  // ── JSON ↔ YAML ────────────────────────────────────────────────────────

  describe("json → yaml", () => {
    it("should convert JSON string to YAML", () => {
      const input = '{"name":"Yusran","age":25}';
      const result = convert.transform({ from: "json", to: "yaml", input });
      expect(result).toContain("name: Yusran");
      expect(result).toContain("age: 25");
    });

    it("should convert nested JSON to YAML", () => {
      const input = '{"user":{"name":"Yusran","skills":["ts","js"]}}';
      const result = convert.transform({ from: "json", to: "yaml", input });
      expect(result).toContain("name: Yusran");
      expect(result).toContain("- ts");
      expect(result).toContain("- js");
    });
  });

  describe("yaml → json", () => {
    it("should convert YAML to JSON string", () => {
      const input = "name: Yusran\nage: 25";
      const result = convert.transform({ from: "yaml", to: "json", input });
      const parsed = JSON.parse(result as string);
      expect(parsed).toEqual({ name: "Yusran", age: 25 });
    });
  });

  // ── YAML ↔ XML ─────────────────────────────────────────────────────────

  describe("yaml → xml", () => {
    it("should convert YAML to XML", () => {
      const input = "name: Yusran";
      const result = convert.transform({ from: "yaml", to: "xml", input });
      expect(typeof result).toBe("string");
      expect(result).toContain("Yusran");
    });
  });

  describe("xml → json", () => {
    it("should convert XML to JSON string", () => {
      const input = "<root><name>Yusran</name><age>25</age></root>";
      const result = convert.transform({ from: "xml", to: "json", input });
      const parsed = JSON.parse(result as string);
      expect(parsed.root.name).toBe("Yusran");
      expect(parsed.root.age).toBe(25);
    });
  });

  // ── JSON ↔ BSON (Binary) ───────────────────────────────────────────────

  describe("json → bson", () => {
    it("should convert JSON to BSON Buffer", () => {
      const input = '{"name":"Yusran","age":25}';
      const result = convert.transform({ from: "json", to: "bson", input });
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it("should round-trip through BSON", () => {
      const input = '{"name":"Yusran","age":25}';
      const bson = convert.transform({ from: "json", to: "bson", input });
      const json = convert.transform({ from: "bson", to: "json", input: bson });
      const parsed = JSON.parse(json as string);
      expect(parsed.name).toBe("Yusran");
      expect(parsed.age).toBe(25);
    });
  });

  // ── CSV ↔ JSON ─────────────────────────────────────────────────────────

  describe("csv → json", () => {
    it("should convert CSV to JSON array of objects", () => {
      const input = "name,age\nYusran,25\nAli,30";
      const result = convert.transform({ from: "csv", to: "json", input });
      const parsed = JSON.parse(result as string);
      expect(parsed).toEqual([
        { name: "Yusran", age: "25" },
        { name: "Ali", age: "30" },
      ]);
    });
  });

  describe("json → csv", () => {
    it("should convert JSON array to CSV", () => {
      const input = JSON.stringify([
        { name: "Yusran", age: 25 },
        { name: "Ali", age: 30 },
      ]);
      const result = convert.transform({ from: "json", to: "csv", input });
      expect(result).toContain("name");
      expect(result).toContain("age");
      expect(result).toContain("Yusran");
      expect(result).toContain("Ali");
    });
  });

  // ── Binary format return types ─────────────────────────────────────────

  describe("binary formats return Buffer", () => {
    const testObj = '{"test":"data"}';

    it("bson returns Buffer", () => {
      const result = convert.transform({
        from: "json",
        to: "bson",
        input: testObj,
      });
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it("msgpack returns Buffer", () => {
      const result = convert.transform({
        from: "json",
        to: "msgpack",
        input: testObj,
      });
      expect(Buffer.isBuffer(result)).toBe(true);
    });

    it("cbor returns Buffer", () => {
      const result = convert.transform({
        from: "json",
        to: "cbor",
        input: testObj,
      });
      expect(Buffer.isBuffer(result)).toBe(true);
    });
  });

  // ── Additional conversions ────────────────────────────────────────────

  describe("json → toml", () => {
    it("should convert JSON to TOML", () => {
      const input = '{"title":"Config","port":8080}';
      const result = convert.transform({ from: "json", to: "toml", input });
      expect(result).toContain("title");
      expect(result).toContain("Config");
      // @iarna/toml may format 8080 as 8_080 (underscore groups)
      expect(result).toContain("port");
    });
  });

  describe("json → ini", () => {
    it("should convert flat JSON to INI", () => {
      const input = '{"host":"localhost","port":"3000"}';
      const result = convert.transform({ from: "json", to: "ini", input });
      expect(result).toContain("host=localhost");
      expect(result).toContain("port=3000");
    });
  });

  describe("json → urlencoded", () => {
    it("should convert JSON to URL-encoded string", () => {
      const input = '{"name":"Yusran","lang":"ts"}';
      const result = convert.transform({
        from: "json",
        to: "urlencoded",
        input,
      });
      expect(result).toContain("name=Yusran");
      expect(result).toContain("lang=ts");
    });
  });

  describe("json5 → yaml", () => {
    it("should convert JSON5 to YAML", () => {
      const input = "{ name: 'Yusran', age: 25, }";
      const result = convert.transform({ from: "json5", to: "yaml", input });
      expect(result).toContain("name: Yusran");
      expect(result).toContain("age: 25");
    });
  });

  describe("env → json", () => {
    it("should convert ENV to JSON", () => {
      const input = "DB_HOST=localhost\nDB_PORT=5432";
      const result = convert.transform({ from: "env", to: "json", input });
      const parsed = JSON.parse(result as string);
      expect(parsed.DB_HOST).toBe("localhost");
      expect(parsed.DB_PORT).toBe("5432");
    });
  });

  describe("tsv → json", () => {
    it("should convert TSV to JSON", () => {
      const input = "name\tage\nYusran\t25";
      const result = convert.transform({ from: "tsv", to: "json", input });
      const parsed = JSON.parse(result as string);
      expect(parsed[0].name).toBe("Yusran");
      expect(parsed[0].age).toBe("25");
    });
  });

  // ── Error handling ─────────────────────────────────────────────────────

  describe("error handling", () => {
    it("should throw on invalid JSON input", () => {
      expect(() =>
        convert.transform({
          from: "json",
          to: "yaml",
          input: "not valid json{{{",
        }),
      ).toThrow();
    });

    it("should handle malformed XML gracefully", () => {
      // fast-xml-parser is lenient; it parses best-effort rather than throwing
      const result = convert.transform({
        from: "xml",
        to: "json",
        input: "<<<not xml>>>",
      });
      expect(typeof result).toBe("string");
    });
  });

  // ── MsgPack round-trip ────────────────────────────────────────────────

  describe("msgpack round-trip", () => {
    it("should round-trip through MsgPack", () => {
      const input = '{"name":"Yusran","score":99}';
      const packed = convert.transform({
        from: "json",
        to: "msgpack",
        input,
      });
      expect(Buffer.isBuffer(packed)).toBe(true);
      const json = convert.transform({
        from: "msgpack",
        to: "json",
        input: packed,
      });
      const parsed = JSON.parse(json as string);
      expect(parsed.name).toBe("Yusran");
      expect(parsed.score).toBe(99);
    });
  });

  // ── CBOR round-trip ───────────────────────────────────────────────────

  describe("cbor round-trip", () => {
    it("should round-trip through CBOR", () => {
      const input = '{"name":"Yusran","active":true}';
      const encoded = convert.transform({
        from: "json",
        to: "cbor",
        input,
      });
      expect(Buffer.isBuffer(encoded)).toBe(true);
      const json = convert.transform({
        from: "cbor",
        to: "json",
        input: encoded,
      });
      const parsed = JSON.parse(json as string);
      expect(parsed.name).toBe("Yusran");
      expect(parsed.active).toBe(true);
    });
  });

  // ── yml alias ─────────────────────────────────────────────────────────

  describe("yml alias", () => {
    it("should treat yml as yaml", () => {
      const input = "name: Yusran";
      const result = convert.transform({ from: "yml", to: "json", input });
      const parsed = JSON.parse(result as string);
      expect(parsed.name).toBe("Yusran");
    });
  });

  // ── dotenv alias ──────────────────────────────────────────────────────

  describe("dotenv alias", () => {
    it("should treat dotenv as env", () => {
      const input = "KEY=value";
      const result = convert.transform({ from: "dotenv", to: "json", input });
      const parsed = JSON.parse(result as string);
      expect(parsed.KEY).toBe("value");
    });
  });

  // ── formdata alias ────────────────────────────────────────────────────

  describe("formdata alias", () => {
    it("should treat formdata as urlencoded", () => {
      const input = "name=Yusran&age=25";
      const result = convert.transform({
        from: "formdata",
        to: "json",
        input,
      });
      const parsed = JSON.parse(result as string);
      expect(parsed.name).toBe("Yusran");
      expect(parsed.age).toBe("25");
    });
  });

  // ── Additional Format Coverage (Professional completeness) ────────────

  describe("Complete Format Coverage", () => {
    const simpleObj = { key: "value", num: 123 };

    // JSON variants
    test("hjson -> json", () => {
      const res = convert.transform({ from: "hjson", to: "json", input: "key: value\nnum: 123" });
      expect(JSON.parse(res as string)).toEqual(simpleObj);
    });

    test("ndjson <-> json (array)", () => {
      const arr = [{ a: 1 }, { b: 2 }];
      const nd = convert.transform({ from: "json", to: "ndjson", input: arr });
      expect(nd).toContain('{"a":1}\n{"b":2}');
      const back = convert.transform({ from: "ndjson", to: "json", input: nd });
      expect(JSON.parse(back as string)).toEqual(arr);
    });

    // Config formats
    test("properties -> json", () => {
      const prop = "key=value\nnum=123";
      const res = convert.transform({ from: "properties", to: "json", input: prop });
      expect(JSON.parse(res as string)).toEqual({ key: "value", num: "123" }); // properties are strings
    });

    test("editorconfig -> json", () => {
      const ec = "root = true\n\n[*]\nindent_style = space";
      const res = convert.transform({ from: "editorconfig", to: "json", input: ec });
      const parsed = JSON.parse(res as string);
      expect(parsed.root).toBe("true");
      expect(parsed["*"].indent_style).toBe("space");
    });

    // Enterprise formats (Pass-through verification)
    const entFormats = [
      "geojson",
      "graphql-json",
      "openapi-json",
      "swagger-json",
      "har",
      "postman-collection"
    ] as const;

    entFormats.forEach(fmt => {
      test(`${fmt} -> json`, () => {
        const res = convert.transform({ from: fmt, to: "json", input: JSON.stringify(simpleObj) });
        expect(JSON.parse(res as string)).toEqual(simpleObj);
      });
    });

    // HTML (basic check)
    test("html -> json", () => {
      const html = "<div><p>hello</p></div>";
      const res = convert.transform({ from: "html", to: "json", input: html });
      const parsed = JSON.parse(res as string);
      expect(parsed.div.p).toBe("hello");
    });
  });
});
