import { ImATeapotException } from '@nestjs/common';

const WHITE_LIST = ['http://localhost:4200'];
export const CORS_HANDLER = (origin: string, callback: Function) => {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (WHITE_LIST.includes(origin)) callback(null, true);
  else callback(new ImATeapotException('Not allowed by CORS'), false);
};

export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  APP_PORT: parseInt(process.env.APP_PORT) || 8080,
  // @ts-ignore
  APP_URL: process.env.APP_URL || `http://localhost:${this!.APP_PORT}`,
  MONGO_CONFIG: {
    USERNAME: process.env.MONGO_USERNAME || 'admin',
    PASSWORD: process.env.MONGO_PASSWORD || 'password',
    HOST: process.env.MONGO_HOSTNAME || 'localhost',
    PORT: parseInt(process.env.MONGO_PORT) || 27017,
    DB: process.env.MONGO_DB || 'panda-manager',
    // URL: `mongodb://${(this.USERNAME)}:${this.PASSWORD}@${this.HOST}:${this.PORT}/${this.DB}?authSource=admin`,
  },
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'your_secret_key',
  OTP_MAIL_ACCOUNT: {
    HOST: process.env.OTP_MAIL_HOST,
    USER: process.env.OTP_MAIL_USER,
    PASS: process.env.OTP_MAIL_PASSWORD,
  },
  CORS_HANDLER,
});
