import p from "fastify-plugin";
import { createTransport as h } from "nodemailer";
import { htmlToText as j } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin as f } from "nodemailer-mjml";
import b from "mjml";
const w = async (e, i) => {
  const { path: g, to: u } = i;
  e.get(g, (l, a) => {
    const { mailer: n } = e, o = b(
      `<mjml>
        <mj-head>
          <mj-attributes>
            <mj-text align="center" color="#555" />
          </mj-attributes>
        </mj-head>
        <mj-body background-color="#eee">
          <mj-section background-color="#fff">
            <mj-column>
              <mj-text align="center">
                <h2>@dzangolab/fastify-mailer</h2>
              </mj-text>
              <mj-text>If you receive this email, then the mail functionality in your Fastify server is enabled and working correctly.</mj-text>
            </mj-column>  
          </mj-section>
        </mj-body>
      </mjml>`
    );
    n.sendMail(
      {
        html: o.html,
        subject: "test email",
        to: u
      },
      (t, d) => {
        t && (e.log.error(t), a.status(500), a.send({
          status: "error",
          message: "Something went wrong",
          error: t
        })), a.status(200), a.send({
          status: "ok",
          message: "Email successfully sent",
          info: d
        });
      }
    );
  });
}, y = async (e, i) => {
  if (e.log.info("Registering fastify-mailer plugin"), Object.keys(i).length === 0) {
    if (e.log.warn(
      "The mailer plugin now recommends passing mailer options directly to the plugin. This time yes"
    ), !e.config?.mailer)
      throw new Error(
        "Missing mailer configuration. Did you forget to pass it to the mailer plugin?"
      );
    i = e.config.mailer;
  }
  const {
    defaults: g,
    templating: u,
    test: l,
    transport: a,
    templateData: n,
    recipients: o
  } = i, t = h(a, g);
  t.use(
    "compile",
    f({
      templateFolder: u.templateFolder
    })
  ), t.use("compile", j());
  const d = {
    ...t,
    sendMail: async (r, s) => {
      let m = {};
      n && (m = { ...m, ...n }), r.templateData && (m = { ...m, ...r.templateData });
      let c = {
        ...r,
        templateData: {
          ...m
        }
      };
      return o && o.length > 0 && (c = {
        ...c,
        bcc: void 0,
        cc: void 0,
        to: o
      }), s ? t.sendMail(c, s) : t.sendMail(c);
    }
  };
  if (e.mailer)
    throw new Error("fastify-mailer has already been registered");
  if (e.decorate("mailer", d), l && l?.enabled) {
    const { path: r, to: s } = l;
    await e.register(w, { path: r, to: s });
  }
}, v = p(y);
export {
  v as default
};
