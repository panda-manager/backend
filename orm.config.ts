const orm = {
  development: {
    url: process.env.MONGO_URL,
  },
  production: {
    url: process.env.MONGO_URL,
  },
};

export default orm[process.env.NODE_ENV];
