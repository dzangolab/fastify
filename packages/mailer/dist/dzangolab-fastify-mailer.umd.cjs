(function(e,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("fastify-plugin"),require("nodemailer"),require("nodemailer-html-to-text"),require("nodemailer-mjml"),require("mjml")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","nodemailer","nodemailer-html-to-text","nodemailer-mjml","mjml"],n):(e=typeof globalThis<"u"?globalThis:e||self,n(e.DzangolabFastifyMailer={},e.FastifyPlugin,e.Nodemailer,e.NodemailerHtmlToText,e.NodemailerMml,e.Mjml))})(this,function(e,n,g,h,y,x){"use strict";const b=async(i,c)=>{const{path:f,to:j}=c;i.get(f,(r,a)=>{const{mailer:s}=i,l=x(`<mjml>
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
      </mjml>`);s.sendMail({html:l.html,subject:"test email",to:j},(t,p)=>{t&&(i.log.error(t),a.status(500),a.send({status:"error",message:"Something went wrong",error:t})),a.status(200),a.send({status:"ok",message:"Email successfully sent",info:p})})})},M=n(async i=>{const{config:c}=i,{defaults:f,templating:j,test:r,transport:a,templateData:s,recipients:l}=c.mailer,t=g.createTransport(a,f);t.use("compile",y.nodemailerMjmlPlugin({templateFolder:j.templateFolder})),t.use("compile",h.htmlToText());const p={...t,sendMail:async(m,d)=>{let o={};s&&(o={...o,...s}),m.templateData&&(o={...o,...m.templateData});let u={...m,templateData:{...o}};return l&&l.length>0&&(u={...u,bcc:void 0,cc:void 0,to:l}),d?t.sendMail(u,d):t.sendMail(u)}};if(i.mailer)throw new Error("fastify-mailer has already been registered");if(i.decorate("mailer",p),r&&r?.enabled){const{path:m,to:d}=r;await i.register(b,{path:m,to:d})}});e.default=M,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
