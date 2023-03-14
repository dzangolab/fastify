import { describe, expect, it } from "vitest";

import createConfig from "../../../__test__/helpers/createConfig";
import updateFields from "../updateFields";

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

describe.concurrent("isSupportedEmailDomain", () => {
  const config = createConfig();

  it("unchange when tenant undefined", async () => {
    const newFields = updateFields(config, formFields);

    expect(newFields).toStrictEqual(formFields);
  });

  it("update email value with tenant id", async () => {
    const tenant = { id: "1" };
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
