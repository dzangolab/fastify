import d from "fastify-plugin";
import { createTransport as g } from "nodemailer";
import { htmlToText as j } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin as p } from "nodemailer-mjml";
import h from "mjml";
const f = async (e, s) => {
  const { path: i, to: c } = s;
  e.get(i, (n, m) => {
    const { mailer: r } = e, a = h(
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
        html: a.html,
        subject: "test email",
        to: c
      },
      (t, o) => {
        t && (e.log.error(t), m.status(500), m.send({
          status: "error",
          message: "Something went wrong",
          error: t
        })), m.status(200), m.send({
          status: "ok",
          message: "Email successfully sent",
          info: o
        });
      }
    );
  });
}, b = async (e) => {
  const { config: s } = e, {
    defaults: i,
    templating: c,
    test: n,
    transport: m,
    templateData: r
  } = s.mailer, a = g(m, i);
  if (a.use(
    "compile",
    p({
      templateFolder: c.templateFolder
    })
  ), a.use("compile", j()), e.mailer)
    throw new Error("fastify-mailer has already been registered");
  if (e.decorate("mailer", {
    ...a,
    sendMail: async (t, o) => {
      let l = {};
      r && (l = { ...l, ...r }), t.templateData && (l = { ...l, ...t.templateData });
      const u = {
        ...t,
        templateData: {
          ...l
        }
      };
      return o ? a.sendMail(u, o) : a.sendMail(u);
    }
  }), n && n?.enabled) {
    const { path: t, to: o } = n;
    e.register(f, { path: t, to: o });
  }
}, F = d(b);
export {
  F as default
};
