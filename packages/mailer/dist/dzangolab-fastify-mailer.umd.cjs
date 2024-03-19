(function(e,m){typeof exports=="object"&&typeof module<"u"?m(exports,require("fastify-plugin"),require("nodemailer"),require("nodemailer-html-to-text"),require("nodemailer-mjml"),require("mjml")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","nodemailer","nodemailer-html-to-text","nodemailer-mjml","mjml"],m):(e=typeof globalThis<"u"?globalThis:e||self,m(e.DzangolabFastifyMailer={},e.FastifyPlugin,e.Nodemailer,e.NodemailerHtmlToText,e.NodemailerMml,e.Mjml))})(this,function(e,m,p,g,h,y){"use strict";const x=async(t,d)=>{const{path:c,to:f}=d;t.get(c,(r,i)=>{const{mailer:s}=t,a=y(`<mjml>
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
      </mjml>`);s.sendMail({html:a.html,subject:"test email",to:f},(l,n)=>{l&&(t.log.error(l),i.status(500),i.send({status:"error",message:"Something went wrong",error:l})),i.status(200),i.send({status:"ok",message:"Email successfully sent",info:n})})})},M=m(async t=>{const{config:d}=t,{defaults:c,templating:f,test:r,transport:i,templateData:s}=d.mailer,a=p.createTransport(i,c);a.use("compile",h.nodemailerMjmlPlugin({templateFolder:f.templateFolder})),a.use("compile",g.htmlToText());const l={...a,sendMail:async(n,u)=>{let o={};s&&(o={...o,...s}),n.templateData&&(o={...o,...n.templateData});const j={...n,templateData:{...o}};return u?a.sendMail(j,u):a.sendMail(j)}};if(t.mailer)throw new Error("fastify-mailer has already been registered");if(t.decorate("mailer",l),r&&r?.enabled){const{path:n,to:u}=r;await t.register(x,{path:n,to:u})}});e.default=M,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
