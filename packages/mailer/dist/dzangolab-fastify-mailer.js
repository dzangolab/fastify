import c from "fastify-plugin";
import { createTransport as u } from "nodemailer";
import { htmlToText as d } from "nodemailer-html-to-text";
import { nodemailerMjmlPlugin as g } from "nodemailer-mjml";
import j from "mjml";
const p = async (a, n) => {
  const { path: s, to: i } = n;
  a.get(s, (l, m) => {
    const { mailer: r } = a, o = j(
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
        html: o.html,
        subject: "test email",
        to: i
      },
      (t, e) => {
        t && (a.log.error(t), m.status(500), m.send({
          status: "error",
          message: "Something went wrong",
          error: t
        })), m.status(200), m.send({
          status: "ok",
          message: "Email successfully sent",
          info: e
        });
      }
    );
  });
}, h = async (a) => {
  const { config: n } = a, {
    defaults: s,
    templating: i,
    test: l,
    transport: m,
    templateData: r
  } = n.mailer, o = u(m, s);
  if (o.use(
    "compile",
    g({
      templateFolder: i.templateFolder
    })
  ), o.use("compile", d()), a.mailer)
    throw new Error("fastify-mailer has already been registered");
  if (a.decorate("mailer", {
    ...o,
    sendMail: async (t) => {
      let e = {};
      return r && (e = { ...e, ...r }), t.templateData && (e = { ...e, ...t.templateData }), o.sendMail({
        ...t,
        templateData: {
          ...e
        }
      });
    }
  }), l && l?.enabled) {
    const { path: t, to: e } = l;
    a.register(p, { path: t, to: e });
  }
}, w = c(h);
export {
  w as default
};
