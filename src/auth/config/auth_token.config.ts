import { NODE_ENV } from '../../environments';

const authTokenConfig = {
  development: {},
  production: {
    expiresIn: '3000h', // TODO: Change expire
  },
};

export default authTokenConfig[NODE_ENV];
