// App
const APP_PORT = parseInt(process.env.PORT) || 8080;
const NODE_ENV = process.env.NODE_ENV;

// DB
const MONGO_URL = process.env.MONGO_URL as string;
const MONGO_PORT = parseInt(process.env.MONGO_PORT);
const MONGO_DB = 'panda-manager';

export { NODE_ENV, APP_PORT, MONGO_URL, MONGO_PORT, MONGO_DB };
