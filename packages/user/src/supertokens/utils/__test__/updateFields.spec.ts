/* eslint-disable unicorn/no-useless-undefined */

import { describe, expect, it } from "vitest";

import createConfig from "../../../__test__/helpers/createConfig";
import updateFields from "../updateFields";

describe.concurrent("isSupportedEmailDomain", () => {
  const config = createConfig();

  const formFields = [
    {
      id: "email",
      value: "abc@example.com",
    },
    {
      id: "password",
      value: "Qwerty12",
    },
  ];

  const tenant = {
    id: "1",
    name: "abc",
    slug: "abc",
    created_at: "2022-02-21 04:48:02",
    updated_at: "2022-02-21 04:48:02",
  };

  it("no change when empty fields provided and undefined tenant", async () => {
    const newFields = updateFields(config, [], undefined);

    expect(newFields).toStrictEqual([]);
  });

  it("no change when email field not exists and tenant undefined", async () => {
    const formFields = [
      {
        id: "user",
        value: "abc@example.com",
      },
      {
        id: "password",
        value: "Qwerty12",
      },
    ];

    const newFields = updateFields(config, formFields, undefined);

    expect(newFields).toStrictEqual(formFields);
  });

  it("no change when email field not exists", async () => {
    const formFields = [
      {
        id: "user",
        value: "abc@example.com",
      },
      {
        id: "password",
        value: "Qwerty12",
      },
    ];

    const newFields = updateFields(config, formFields, tenant);

    expect(newFields).toStrictEqual(formFields);
  });

  it("no change when tenant undefined", async () => {
    const newFields = updateFields(config, formFields, undefined);

    expect(newFields).toStrictEqual(formFields);
  });

  it("update email value with tenant id", async () => {
    const expectedFormFields = [
      {
        id: "email",
        value: "1_abc@example.com",
      },
      {
        id: "password",
        value: "Qwerty12",
      },
    ];

    const newFields = updateFields(config, formFields, tenant);

    expect(newFields).toStrictEqual(expectedFormFields);
  });
});
