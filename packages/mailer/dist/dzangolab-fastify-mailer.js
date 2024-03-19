import g from "fastify-plugin";
import { createTransport as j } from "nodemailer";
import { htmlToText as p } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin as h } from "nodemailer-mjml";
import f from "mjml";
const b = async (t, i) => {
  const { path: c, to: u } = i;
  t.get(c, (l, m) => {
    const { mailer: n } = t, e = f(
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
        html: e.html,
        subject: "test email",
        to: u
      },
      (o, a) => {
        o && (t.log.error(o), m.status(500), m.send({
          status: "error",
          message: "Something went wrong",
          error: o
        })), m.status(200), m.send({
          status: "ok",
          message: "Email successfully sent",
          info: a
        });
      }
    );
  });
}, x = async (t) => {
  const { config: i } = t, {
    defaults: c,
    templating: u,
    test: l,
    transport: m,
    templateData: n
  } = i.mailer, e = j(m, c);
  e.use(
    "compile",
    h({
      templateFolder: u.templateFolder
    })
  ), e.use("compile", p());
  const o = {
    ...e,
    sendMail: async (a, s) => {
      let r = {};
      n && (r = { ...r, ...n }), a.templateData && (r = { ...r, ...a.templateData });
      const d = {
        ...a,
        templateData: {
          ...r
        }
      };
      return s ? e.sendMail(d, s) : e.sendMail(d);
    }
  };
  if (t.mailer)
    throw new Error("fastify-mailer has already been registered");
  if (t.decorate("mailer", o), l && l?.enabled) {
    const { path: a, to: s } = l;
    await t.register(b, { path: a, to: s });
  }
}, T = g(x);
export {
  T as default
};
