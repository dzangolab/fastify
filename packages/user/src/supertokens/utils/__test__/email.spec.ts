/* eslint-disable unicorn/no-useless-undefined */

import { describe, expect, it } from "vitest";

import createConfig from "../../../__test__/helpers/createConfig";
import Email from "../email";

import type { ApiConfig } from "@dzangolab/fastify-config";

const tenant = {
  id: "1",
  name: "abc",
  slug: "abc",
  created_at: "1645442738000",
  updated_at: "1645442738000",
};

describe.concurrent("Email.addTenantPrefixEmail()", () => {
  const config = createConfig();

  it("return original email when tenant undefined", async () => {
    const originalEmail = "user@example.com";

    const updatedEmail = Email.addTenantPrefix(
      config,
      originalEmail,
      undefined
    );

    expect(updatedEmail).toStrictEqual(originalEmail);
  });

  it("return updated email when tenant defined", async () => {
    const originalEmail = "user@example.com";

    const updatedEmail = Email.addTenantPrefix(config, originalEmail, tenant);

    expect(updatedEmail).toStrictEqual(tenant.id + "_" + originalEmail);
  });

  it("return updated email when tenant id identifier is different", async () => {
    const tenant = {
      identifier: "2",
      name: "abc",
      slug: "abc",
      created_at: "1645442738000",
      updated_at: "1645442738000",
    };

    const config = {
      multiTenant: {
        table: {
          columns: {
            id: "identifier",
          },
        },
      },
    } as ApiConfig;

    const originalEmail = "user@example.com";

    const updatedEmail = Email.addTenantPrefix(config, originalEmail, tenant);

    expect(updatedEmail).toStrictEqual(tenant.identifier + "_" + originalEmail);
  });

  it("return update email when complex email address passed", async () => {
    const originalEmail = "1_user@example.com";

    const updatedEmail = Email.addTenantPrefix(config, originalEmail, tenant);

    expect(updatedEmail).toStrictEqual(tenant.id + "_" + originalEmail);
  });
});

describe.concurrent("Email.removeTenantPrefix()", () => {
  it("return original email when tenant undefined", async () => {
    const originalEmail = "user@example.com";

    const updatedEmail = Email.removeTenantPrefix(originalEmail, undefined);

    expect(updatedEmail).toStrictEqual(originalEmail);
  });

  it("return updated email when tenant defined", async () => {
    const originalEmail = "1_user@example.com";

    const updatedEmail = Email.removeTenantPrefix(originalEmail, tenant);

    expect(updatedEmail).toStrictEqual("user@example.com");
  });

  it("return updated email when tenant defined with mappedId", async () => {
    const tenant = {
      identifier: "2",
      name: "abc",
      slug: "abc",
      created_at: "1645442738000",
      updated_at: "1645442738000",
    };

    const originalEmail = "2_user@example.com";

    const updatedEmail = Email.removeTenantPrefix(originalEmail, tenant);

    expect(updatedEmail).toStrictEqual("user@example.com");
  });

  it("return update email when complex email address passed", async () => {
    const originalEmail = "1_1_user@example.com";

    const updatedEmail = Email.removeTenantPrefix(originalEmail, tenant);

    expect(updatedEmail).toStrictEqual("1_user@example.com");
  });
});
