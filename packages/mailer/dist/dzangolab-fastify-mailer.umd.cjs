(function(e,l){typeof exports=="object"&&typeof module<"u"?l(exports,require("fastify-plugin"),require("nodemailer"),require("nodemailer-html-to-text"),require("nodemailer-mjml"),require("mjml")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","nodemailer","nodemailer-html-to-text","nodemailer-mjml","mjml"],l):(e=typeof globalThis<"u"?globalThis:e||self,l(e.DzangolabFastifyMailer={},e.FastifyPlugin,e.Nodemailer,e.NodemailerHtmlToText,e.NodemailerMml,e.Mjml))})(this,function(e,l,g,h,y,x){"use strict";const b=async(t,i)=>{const{path:c,to:f}=i;t.get(c,(s,m)=>{const{mailer:d}=t,n=x(`<mjml>
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
      </mjml>`);d.sendMail({html:n.html,subject:"test email",to:f},(o,a)=>{o&&(t.log.error(o),m.status(500),m.send({status:"error",message:"Something went wrong",error:o})),m.status(200),m.send({status:"ok",message:"Email successfully sent",info:a})})})},M=async(t,i)=>{i.config.mercurius.enabled&&(t.mailer=i.mailer)},j=l(async t=>{const{config:i}=t,{defaults:c,templating:f,test:s,transport:m,templateData:d}=i.mailer,n=g.createTransport(m,c);n.use("compile",y.nodemailerMjmlPlugin({templateFolder:f.templateFolder})),n.use("compile",h.htmlToText());const o={...n,sendMail:async(a,u)=>{let r={};d&&(r={...r,...d}),a.templateData&&(r={...r,...a.templateData});const p={...a,templateData:{...r}};return u?n.sendMail(p,u):n.sendMail(p)}};if(t.mailer)throw new Error("fastify-mailer has already been registered");if(t.decorate("mailer",o),t.addHook("onRequest",async a=>{a.mailer=o}),s&&s?.enabled){const{path:a,to:u}=s;await t.register(b,{path:a,to:u})}});j.updateContext=M,e.default=j,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
