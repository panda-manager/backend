const MONGO_URL = process.env.MONGO_URL

const orm = {
  development: {
    url: MONGO_URL!,
  },
  testing: {
    url: MONGO_URL!,
  },
  staging: {
    url: MONGO_URL!,
  },
  production: {
    url: MONGO_URL!,
  },
};

export default orm[process.env.NODE_ENV];
