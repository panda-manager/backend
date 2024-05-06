import { Transporter } from 'nodemailer';
export default (
  transporter: Transporter,
  email: string,
  title: string,
  body: any,
) => {
  // Send emails to users
  return transporter.sendMail({
    to: email,
    from: process.env.OTP_MAIL_USER,
    subject: title,
    html: body,
  });
};
