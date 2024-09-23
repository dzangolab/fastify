(function(e,a){typeof exports=="object"&&typeof module<"u"?a(exports,require("fastify-plugin"),require("nodemailer"),require("nodemailer-html-to-text"),require("nodemailer-mjml"),require("mjml")):typeof define=="function"&&define.amd?define(["exports","fastify-plugin","nodemailer","nodemailer-html-to-text","nodemailer-mjml","mjml"],a):(e=typeof globalThis<"u"?globalThis:e||self,a(e.DzangolabFastifyMailer={},e.FastifyPlugin,e.Nodemailer,e.NodemailerHtmlToText,e.NodemailerMml,e.Mjml))})(this,function(e,a,h,j,y,b){"use strict";const x=async(t,l)=>{const{path:g,to:f}=l;t.get(g,(s,n)=>{const{mailer:u}=t,r=b(`<mjml>
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
      </mjml>`);u.sendMail({html:r.html,subject:"test email",to:f},(i,p)=>{i&&(t.log.error(i),n.status(500),n.send({status:"error",message:"Something went wrong",error:i})),n.status(200),n.send({status:"ok",message:"Email successfully sent",info:p})})})},M=a(async(t,l)=>{if(t.log.info("Registering fastify-mailer plugin"),Object.keys(l).length===0){if(t.log.warn("The mailer plugin now recommends passing mailer options directly to the plugin. This time yes"),!t.config.mailer)throw new Error("Missing mailer configuration. Did you forget to pass it to the mailer plugin?");l=t.config.mailer}const{defaults:g,templating:f,test:s,transport:n,templateData:u,recipients:r}=l,i=h.createTransport(n,g);i.use("compile",y.nodemailerMjmlPlugin({templateFolder:f.templateFolder})),i.use("compile",j.htmlToText());const p={...i,sendMail:async(o,d)=>{let m={};u&&(m={...m,...u}),o.templateData&&(m={...m,...o.templateData});let c={...o,templateData:{...m}};return r&&r.length>0&&(c={...c,bcc:void 0,cc:void 0,to:r}),d?i.sendMail(c,d):i.sendMail(c)}};if(t.mailer)throw new Error("fastify-mailer has already been registered");if(t.decorate("mailer",p),s&&s?.enabled){const{path:o,to:d}=s;await t.register(x,{path:o,to:d})}});e.default=M,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
