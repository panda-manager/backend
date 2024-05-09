import { ImATeapotException } from '@nestjs/common';

const WHITE_LIST = ['*'];
export const CORS_HANDLER = (origin: string, callback: CallableFunction) => {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (WHITE_LIST.includes('*') || WHITE_LIST.includes(origin))
    callback(null, true);
  else callback(new ImATeapotException('Not allowed by CORS'), false);
};

export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: parseInt(process.env.APP_PORT),
  APP_URL: process.env.APP_URL,
  MONGO_CONFIG: {
    USERNAME: process.env.MONGO_USERNAME,
    PASSWORD: process.env.MONGO_PASSWORD,
    HOST: process.env.MONGO_HOSTNAME,
    PORT: parseInt(process.env.MONGO_PORT),
    DB: process.env.MONGO_DB,
  },
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  OTP_MAIL_ACCOUNT: {
    HOST: process.env.OTP_MAIL_HOST,
    PORT: process.env.OTP_MAIL_PORT,
    USER: process.env.OTP_MAIL_USER,
    PASS: process.env.OTP_MAIL_PASSWORD,
  },
  CORS_HANDLER,
});
