import { Configs } from "../config/config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: Configs.email_host,
  port: Configs.email_port,
  secure: Configs.email_secure,
  auth: {
    user: Configs.email_user,
    pass: Configs.email_pass,
  },
});

export async function sendVerificationEmail(to, verificationToken) {
  const verifyLink = `${Configs.base_url}/api/auth/verify/${verificationToken}`;
  const mailOptions = {
    from: Configs.email_from || Configs.email_user,
    to,
    subject: "Email verification",
    text: `Please verify your email by clicking the link: ${verifyLink}`,
    html: `<p>Please verify your email by clicking the link below:</p>
           <p><a href="${verifyLink}">${verifyLink}</a></p>`,
  };

  return transporter.sendMail(mailOptions);
}
