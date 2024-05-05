import * as nodemailer from 'nodemailer';
import { OTP_CONFIG } from '../../environments';
export default async (email: string, title: string, body: any) => {
  const transporter = nodemailer.createTransport({
    host: OTP_CONFIG.OTP_MAIL_HOST,
    auth: {
      user: OTP_CONFIG.OTP_MAIL_USER,
      pass: OTP_CONFIG.OTP_MAIL_PASSWORD,
    }
  });
  // Send emails to users
  const info = await transporter.sendMail({
    from: 'PandaManager',
    to: email,
    subject: title,
    html: body,
  });
  console.log("Email info: ", info);
  return info;
};