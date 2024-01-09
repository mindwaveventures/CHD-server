import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

import appConfig from "../app-config";
import { Custom } from "../types";

const {
  useSendgrid,
  sendGridApi,
  emailAuthPassword,
  emailAuthUsername,
  emailHost,
  emailPort,
  fromMail,
} = appConfig;

let transport: any;
// Sendgrid disabled on SMTP requirement
// if (useSendgrid) {
//   transport = nodemailer.createTransport(
//     nodemailerSendgrid({
//       apiKey: sendGridApi,
//     })
//   );
// } else {
  transport = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false, // use TLS
    logger: true,
    auth: {
      user: emailAuthUsername,
      pass: emailAuthPassword,
    },
  });
// }

export default async (data: Custom.EmailContent) => {
  try {
    const { to, subject, html } = data;
    const options = {
      from: data.from || fromMail,
      to,
      subject,
      html,
    };
    return await transport.sendMail(options);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
