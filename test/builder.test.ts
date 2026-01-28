import { describe, test, expect } from "bun:test";
import { jstatico, JstaticoBuilder } from "../src/builder";

describe("JstaticoBuilder", () => {
  test("jstatico() returns a builder instance", () => {
    const builder = jstatico("./src", "./dist");
    expect(builder).toBeInstanceOf(JstaticoBuilder);
  });

  test("addPreprocessor returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.addPreprocessor({
      match: /\.test$/,
      parse() { return this; }
    });
    expect(result).toBe(builder);
  });

  test("addPostprocessor returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.addPostprocessor({
      match: /\.test$/,
      process() { return this; }
    });
    expect(result).toBe(builder);
  });

  test("addWriter returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.addWriter({
      match: /\.test$/,
      write() {}
    });
    expect(result).toBe(builder);
  });

  test("disableBuiltinPreprocessor returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.disableBuiltinPreprocessor("markdown");
    expect(result).toBe(builder);
  });

  test("clearBuiltinPreprocessors returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.clearBuiltinPreprocessors();
    expect(result).toBe(builder);
  });

  test("skipAutoDiscovery returns builder for chaining", () => {
    const builder = jstatico("./src", "./dist");
    const result = builder.skipAutoDiscovery();
    expect(result).toBe(builder);
  });
});
