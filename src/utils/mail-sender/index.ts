import * as nodemailer from 'nodemailer';
import { Logger } from '@nestjs/common';
export default (transporter, email: string, title: string, body: any) => {
  // Send emails to users
  return transporter.sendMail({
    from: 'PandaManager',
    to: email,
    subject: title,
    html: body,
  });
};
