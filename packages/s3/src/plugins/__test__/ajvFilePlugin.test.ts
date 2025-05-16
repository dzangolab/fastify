import Ajv from "ajv";
import { describe, it, expect } from "vitest";

import plugin from "../ajvFile";

describe("ajvFile plugin", () => {
  it("should register the isFile keyword and validate file schemas correctly", () => {
    const ajv = new Ajv();

    ajv.addFormat("binary", {
      type: "string",
      validate: () => true, // no-op validation
    });

    plugin(ajv);

    const schema = {
      type: "object",
      properties: {
        file: { isFile: true },
      },
      required: ["file"],
    };

    const validate = ajv.compile(schema);

    const validData = {
      file: {
        filename: "test.txt",
        mimetype: "text/plain",
        data: Buffer.from("test"),
      },
    };
    const invalidData = { file: { name: "test.txt" } }; // Missing `filename` and `mimetype`

    expect(validate(validData)).toBe(true);
    expect(validate(invalidData)).toBe(false);
    expect(validate.errors?.[0]?.message).toBe(
      "should be a file or array of files",
    );
  });

  it("should validate arrays of files when isFile is used in an array schema", () => {
    const ajv = new Ajv();

    ajv.addFormat("binary", {
      type: "string",
      validate: () => true, // no-op validation
    });

    plugin(ajv);

    const schema = {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { isFile: true },
        },
      },
      required: ["files"],
    };

    const validate = ajv.compile(schema);

    const validData = {
      files: [
        {
          filename: "test1.txt",
          mimetype: "text/plain",
          data: Buffer.from("test"),
        },
        {
          filename: "test2.jpg",
          mimetype: "image/jpeg",
          data: Buffer.from("test"),
        },
      ],
    };

    const invalidData = {
      files: [
        { filename: "test1.txt", mimetype: "text/plain" },
        { name: "test2.jpg" }, // Invalid file object
      ],
    };

    expect(validate(validData)).toBe(true);
    expect(validate(invalidData)).toBe(false);
    expect(validate.errors?.[0]?.message).toBe(
      "should be a file or array of files",
    );
  });
});
