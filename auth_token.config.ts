const auth_token_config = {
  development: {},
  production: {
    expiresIn: '24h',
  },
};

export default auth_token_config[process.env.NODE_ENV];
