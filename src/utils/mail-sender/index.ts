import { Transporter } from 'nodemailer';
export default (
  transporter: Transporter,
  to: string,
  from: string,
  title: string,
  body: any,
) => {
  // Send emails to users
  return transporter.sendMail({
    to: to,
    from: from,
    subject: title,
    html: body,
  });
};
