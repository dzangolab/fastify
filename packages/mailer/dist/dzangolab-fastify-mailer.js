import p from "fastify-plugin";
import { createTransport as h } from "nodemailer";
import { htmlToText as j } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin as f } from "nodemailer-mjml";
import b from "mjml";
const y = async (e, m) => {
  const { path: g, to: u } = m;
  e.get(g, (n, a) => {
    const { mailer: r } = e, l = b(
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
    r.sendMail(
      {
        html: l.html,
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
}, w = async (e, m) => {
  e.log.info("Registering fastify-mailer plugin"), Object.keys(m).length === 0 && (e.log.warn(
    "The mailer plugin now recommends passing mailer options directly to the plugin. This time yes"
  ), m = e.config.mailer);
  const {
    defaults: g,
    templating: u,
    test: n,
    transport: a,
    templateData: r,
    recipients: l
  } = m, t = h(a, g);
  t.use(
    "compile",
    f({
      templateFolder: u.templateFolder
    })
  ), t.use("compile", j());
  const d = {
    ...t,
    sendMail: async (o, s) => {
      let i = {};
      r && (i = { ...i, ...r }), o.templateData && (i = { ...i, ...o.templateData });
      let c = {
        ...o,
        templateData: {
          ...i
        }
      };
      return l && l.length > 0 && (c = {
        ...c,
        bcc: void 0,
        cc: void 0,
        to: l
      }), s ? t.sendMail(c, s) : t.sendMail(c);
    }
  };
  if (e.mailer)
    throw new Error("fastify-mailer has already been registered");
  if (e.decorate("mailer", d), n && n?.enabled) {
    const { path: o, to: s } = n;
    await e.register(y, { path: o, to: s });
  }
}, v = p(w);
export {
  v as default
};
