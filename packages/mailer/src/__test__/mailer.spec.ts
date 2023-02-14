vi.mock("nodemailer", () => ({
  createTransport: createTransportMock,
}));

const nodemailerMjmlPluginMock = vi.fn();
vi.mock("nodemailer-mjml", () => ({
  nodemailerMjmlPlugin: nodemailerMjmlPluginMock,
}));

const htmlToTextMock = vi.fn();
vi.mock("nodemailer-html-to-text", () => ({
  htmlToText: htmlToTextMock,
}));

const sendMailMock = vi.fn().mockImplementation((config, callback) => {
  callback();
});
const useMock = vi.fn();
const createTransportMock = vi.fn().mockReturnValue({
  sendMail: sendMailMock,
  use: useMock,
});

import fastify from "fastify";
import { describe, expect, it, vi, beforeEach } from "vitest";

import createMailerConfig from "./helpers/createMailerConfig";
import plugin from "../plugin";

import type { FastifyInstance } from "fastify";

describe("Mailer", async () => {
  let api: FastifyInstance;

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

  // it("Should throw error if mailer already registerd to api", async () => {
  //   await api.register(plugin);
  //   expect(await api.register(plugin)).toThrowError(Error);
  // });

  it("Should call SendMail method ", async () => {
    const {
      test: { path },
    } = createMailerConfig().mailer;

    await api.register(plugin);

    await api.inject({
      method: "GET",
      path: path,
    });

    expect(sendMailMock).toHaveBeenCalled();
  });
});
