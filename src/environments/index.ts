import { ImATeapotException } from '@nestjs/common';
import { expand as expandDotenv } from 'dotenv-expand';
import { configDotenv } from 'dotenv';

const env = configDotenv();
expandDotenv(env);

//#region CORS
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
//#endregion

//#region APP
export const NODE_ENV = process.env.NODE_ENV;

export const APP_PORT = parseInt(process.env.APP_PORT) || 8080;

export const APP_URL = process.env.APP_URL;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
//#endregion

//#region DB
export const MONGO_URL = process.env.MONGO_URL;
//#endregion

export default () => ({
  NODE_ENV,
  APP_PORT,
  APP_URL,
  MONGO_URL,
  ACCESS_TOKEN_SECRET,
  CORS_HANDLER,
});
