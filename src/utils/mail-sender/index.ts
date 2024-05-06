import { Transporter } from 'nodemailer';
export default (
  transporter: Transporter,
  email: string,
  from: string,
  title: string,
  body: any,
) => {
  // Send emails to users
  return transporter.sendMail({
    to: email,
    from: from,
    subject: title,
    html: body,
  });
};
