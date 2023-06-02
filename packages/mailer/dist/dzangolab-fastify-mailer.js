import g from "fastify-plugin";
import { createTransport as p } from "nodemailer";
import { htmlToText as j } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin as f } from "nodemailer-mjml";
import h from "mjml";
const b = async (t, m) => {
  const { path: c, to: u } = m;
  t.get(c, (l, o) => {
    const { mailer: s } = t, a = h(
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
    s.sendMail(
      {
        html: a.html,
        subject: "test email",
        to: u
      },
      (n, e) => {
        n && (t.log.error(n), o.status(500), o.send({
          status: "error",
          message: "Something went wrong",
          error: n
        })), o.status(200), o.send({
          status: "ok",
          message: "Email successfully sent",
          info: e
        });
      }
    );
  });
}, x = async (t, m) => {
  m.config.mercurius.enabled && (t.mailer = m.mailer);
}, y = async (t) => {
  const { config: m } = t, {
    defaults: c,
    templating: u,
    test: l,
    transport: o,
    templateData: s
  } = m.mailer, a = p(o, c);
  a.use(
    "compile",
    f({
      templateFolder: u.templateFolder
    })
  ), a.use("compile", j());
  const n = {
    ...a,
    sendMail: async (e, i) => {
      let r = {};
      s && (r = { ...r, ...s }), e.templateData && (r = { ...r, ...e.templateData });
      const d = {
        ...e,
        templateData: {
          ...r
        }
      };
      return i ? a.sendMail(d, i) : a.sendMail(d);
    }
  };
  if (t.mailer)
    throw new Error("fastify-mailer has already been registered");
  if (t.decorate("mailer", n), t.addHook("onRequest", async (e) => {
    e.mailer = n;
  }), l && l?.enabled) {
    const { path: e, to: i } = l;
    await t.register(b, { path: e, to: i });
  }
}, w = g(y);
w.updateContext = x;
export {
  w as default
};
