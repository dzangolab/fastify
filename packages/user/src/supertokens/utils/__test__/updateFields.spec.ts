/* eslint-disable unicorn/no-useless-undefined */
import { describe, expect, it } from "vitest";

import createConfig from "../../../__test__/helpers/createConfig";
import updateFields from "../updateFields";

import type { ApiConfig } from "@dzangolab/fastify-config";

const getFormFields = () => [
  {
    id: "email",
    value: "abc@example.com",
  },
  {
    id: "password",
    value: "Qwerty12",
  },
];

describe.concurrent("updateFields", () => {
  const config = createConfig();

  const tenant = {
    id: "1",
    name: "abc",
    slug: "abc",
    created_at: "1645442738000",
    updated_at: "1645442738000",
  };

  it("no change when empty field provided and undefined tenant", async () => {
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

    const newFields = updateFields(config, [...formFields], undefined);

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

    const expectedFormFields = [
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

    expect(newFields).toStrictEqual(expectedFormFields);
  });

  it("no change when tenant undefined", async () => {
    const newFields = updateFields(config, getFormFields(), undefined);

    expect(newFields).toStrictEqual(getFormFields());
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

    const newFields = updateFields(config, getFormFields(), tenant);

    expect(newFields).toStrictEqual(expectedFormFields);
  });

  it("update email value with changed tenant id identifier", async () => {
    const config = {
      multiTenant: {
        table: {
          columns: {
            id: "identifier",
          },
        },
      },
    } as ApiConfig;

    const expectedFormFields = [
      {
        id: "email",
        value: "2_abc@example.com",
      },
      {
        id: "password",
        value: "Qwerty12",
      },
    ];

    const tenant = {
      identifier: "2",
      name: "abc",
      slug: "abc",
      created_at: "1645442738000",
      updated_at: "1645442738000",
    };

    const newFields = updateFields(config, getFormFields(), tenant);

    expect(newFields).toStrictEqual(expectedFormFields);
  });
});
