import fastify from "fastify";
import { describe, expect, it, vi, beforeEach } from "vitest";

import createMailerConfig from "./helpers/createMailerConfig";

import type { FastifyInstance } from "fastify";

const nodemailerMjmlPluginMock = vi.fn();
const htmlToTextMock = vi.fn();
const useMock = vi.fn();
const sendMailMock = vi.fn().mockImplementation((config, callback) => {
  callback();
});
const createTransportMock = vi.fn().mockReturnValue({
  sendMail: sendMailMock,
  use: useMock,
});

vi.mock("nodemailer", () => ({
  createTransport: createTransportMock,
}));

vi.mock("nodemailer-mjml", () => ({
  nodemailerMjmlPlugin: nodemailerMjmlPluginMock,
}));

vi.mock("nodemailer-html-to-text", () => ({
  htmlToText: htmlToTextMock,
}));

describe("Mailer", async () => {
  let api: FastifyInstance;

  /* eslint-disable-next-line node/no-unsupported-features/es-syntax */
  const { default: plugin } = await import("../plugin");

  beforeEach(async () => {
    api = await fastify();

    api.decorate("config", createMailerConfig());
  });

  it("Create Mailer instance with ", async () => {
    const { transport, defaults, templating } = createMailerConfig().mailer;
    await api.register(plugin);

    expect(createTransportMock).toHaveBeenCalledWith(transport, defaults);

    expect(useMock).toHaveBeenCalledWith("compile", nodemailerMjmlPluginMock());

    expect(useMock).toHaveBeenCalledWith("compile", htmlToTextMock());

    expect(nodemailerMjmlPluginMock).toHaveBeenCalledWith({
      templateFolder: templating.templateFolder,
    });
  });

  it("Should throw error if mailer already registerd to api", async () => {
    await api.register(plugin);

    await expect(api.register(plugin)).rejects.toThrowError(
      "fastify-mailer has already been registered"
    );
  });

  it("Should call SendMail method ", async () => {
    const {
      templateData,
      test: { path, to },
    } = createMailerConfig().mailer;

    await api.register(plugin);

    await api.inject({
      method: "GET",
      path: path,
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      {
        html: expect.stringContaining("<!doctype html>"),
        subject: "test email",
        to: to,
        templateData: templateData,
      },
      expect.any(Function)
    );
  });
});
