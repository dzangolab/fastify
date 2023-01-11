(function(e,l){typeof exports=="object"&&typeof module<"u"?l(exports,require("fastify-plugin"),require("nodemailer"),require("nodemailer-html-to-text"),require("nodemailer-mjml"),require("mjml")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","nodemailer","nodemailer-html-to-text","nodemailer-mjml","mjml"],l):(e=typeof globalThis<"u"?globalThis:e||self,l(e.DzangolabFastifyMailer={},e.FastifyPlugin,e.Nodemailer,e.NodemailerHtmlToText,e.NodemailerMml,e.Mjml))})(this,function(e,l,c,f,j,g){"use strict";const p=async(m,s)=>{const{path:u,to:d}=s;m.get(u,(o,n)=>{const{mailer:r}=m,i=g(`<mjml>
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
      </mjml>`);r.sendMail({html:i.html,subject:"test email",to:d},(t,a)=>{t&&(m.log.error(t),n.status(500),n.send({status:"error",message:"Something went wrong",error:t})),n.status(200),n.send({status:"ok",message:"Email successfully sent",info:a})})})},h=l(async m=>{const{config:s}=m,{defaults:u,templating:d,test:o,transport:n,templateData:r}=s.mailer,i=c.createTransport(n,u);if(i.use("compile",j.nodemailerMjmlPlugin({templateFolder:d.templateFolder})),i.use("compile",f.htmlToText()),m.mailer)throw new Error("fastify-mailer has already been registered");if(m.decorate("mailer",{...i,sendMail:async t=>{let a={};return r&&(a={...a,...r}),t.templateData&&(a={...a,...t.templateData}),i.sendMail({...t,templateData:{...a}})}}),o&&o?.enabled){const{path:t,to:a}=o;m.register(p,{path:t,to:a})}});e.default=h,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
