import { Transporter } from 'nodemailer';
export default (
  transporter: Transporter,
  email: string,
  title: string,
  body: any,
) => {
  // Send emails to users
  return transporter.sendMail({
    from: 'PandaManager',
    to: email,
    subject: title,
    html: body,
  });
};
