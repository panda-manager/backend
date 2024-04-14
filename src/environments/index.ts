const PORT = parseInt(process.env.PORT) || 8080;
const MONGO_URL = process.env.MONGO_URL as string;

export { PORT, MONGO_URL };
