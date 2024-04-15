// App
const APP_PORT = parseInt(process.env.PORT) || 8080;
const APP_URL = process.env.APP_URL || `http://localhost:${APP_PORT}`;
const NODE_ENV = process.env.NODE_ENV;

// DB
const MONGO_URL = process.env.MONGO_URL as string;
const MONGO_PORT = parseInt(process.env.MONGO_PORT);
const MONGO_DB = 'panda-manager';

// AUTH
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export {
  ACCESS_TOKEN_SECRET,
  NODE_ENV,
  APP_URL,
  APP_PORT,
  MONGO_URL,
  MONGO_PORT,
  MONGO_DB,
};
