import p from "fastify-plugin";
import { createTransport as j } from "nodemailer";
import { htmlToText as h } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin as f } from "nodemailer-mjml";
import b from "mjml";
const x = async (e, c) => {
  const { path: d, to: u } = c;
  e.get(d, (r, a) => {
    const { mailer: n } = e, m = b(
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
        html: m.html,
        subject: "test email",
        to: u
      },
      (t, g) => {
        t && (e.log.error(t), a.status(500), a.send({
          status: "error",
          message: "Something went wrong",
          error: t
        })), a.status(200), a.send({
          status: "ok",
          message: "Email successfully sent",
          info: g
        });
      }
    );
  });
}, y = async (e) => {
  const { config: c } = e, {
    defaults: d,
    templating: u,
    test: r,
    transport: a,
    templateData: n,
    recipients: m
  } = c.mailer, t = j(a, d);
  t.use(
    "compile",
    f({
      templateFolder: u.templateFolder
    })
  ), t.use("compile", h());
  const g = {
    ...t,
    sendMail: async (o, i) => {
      let l = {};
      n && (l = { ...l, ...n }), o.templateData && (l = { ...l, ...o.templateData });
      let s = {
        ...o,
        templateData: {
          ...l
        }
      };
      return m && m.length > 0 && (s = {
        ...s,
        bcc: void 0,
        cc: void 0,
        to: m
      }), i ? t.sendMail(s, i) : t.sendMail(s);
    }
  };
  if (e.mailer)
    throw new Error("fastify-mailer has already been registered");
  if (e.decorate("mailer", g), r && r?.enabled) {
    const { path: o, to: i } = r;
    await e.register(x, { path: o, to: i });
  }
}, T = p(y);
export {
  T as default
};
