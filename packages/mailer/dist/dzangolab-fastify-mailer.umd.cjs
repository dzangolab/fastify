(function(e,l){typeof exports=="object"&&typeof module<"u"?l(exports,require("fastify-plugin"),require("nodemailer"),require("nodemailer-html-to-text"),require("nodemailer-mjml"),require("mjml")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","nodemailer","nodemailer-html-to-text","nodemailer-mjml","mjml"],l):(e=typeof globalThis<"u"?globalThis:e||self,l(e.DzangolabFastifyMailer={},e.FastifyPlugin,e.Nodemailer,e.NodemailerHtmlToText,e.NodemailerMml,e.Mjml))})(this,function(e,l,j,p,g,h){"use strict";const y=async(a,u)=>{const{path:d,to:c}=u;a.get(d,(r,i)=>{const{mailer:s}=a,n=h(`<mjml>
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
      </mjml>`);s.sendMail({html:n.html,subject:"test email",to:c},(t,m)=>{t&&(a.log.error(t),i.status(500),i.send({status:"error",message:"Something went wrong",error:t})),i.status(200),i.send({status:"ok",message:"Email successfully sent",info:m})})})},x=l(async a=>{const{config:u}=a,{defaults:d,templating:c,test:r,transport:i,templateData:s}=u.mailer,n=j.createTransport(i,d);if(n.use("compile",g.nodemailerMjmlPlugin({templateFolder:c.templateFolder})),n.use("compile",p.htmlToText()),a.mailer)throw new Error("fastify-mailer has already been registered");if(a.decorate("mailer",{...n,sendMail:async(t,m)=>{let o={};s&&(o={...o,...s}),t.templateData&&(o={...o,...t.templateData});const f={...t,templateData:{...o}};return m?n.sendMail(f,m):n.sendMail(f)}}),r&&r?.enabled){const{path:t,to:m}=r;a.register(y,{path:t,to:m})}});e.default=x,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
