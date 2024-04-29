//#region App
const APP_PORT = parseInt(process.env.PORT) || 8080;
const APP_URL = process.env.APP_URL || `http://localhost:${APP_PORT}`;
const NODE_ENV = process.env.NODE_ENV;
//#endregion

//#region DB
const MONGO_USERNAME = process.env.MONGO_USERNAME || 'admin';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'password';
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || 'localhost';
const MONGO_PORT = parseInt(process.env.MONGO_PORT) || 27017;
const MONGO_DB = 'panda-manager';
const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
//#endregion

//#region AUTH
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_secret_key';
//#endregion

export {
  ACCESS_TOKEN_SECRET,
  NODE_ENV,
  APP_URL,
  APP_PORT,
  MONGO_URL,
  MONGO_PORT,
  MONGO_DB,
};
