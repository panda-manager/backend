import { NODE_ENV } from '../../../environments';
import { Mode } from '../../../common';
import { JwtSignOptions } from '@nestjs/jwt';

const authTokenConfig: Partial<Record<Mode, Partial<JwtSignOptions>>> = {
  production: {
    expiresIn: '3000h',
  },
};

export default authTokenConfig[NODE_ENV] || {};
