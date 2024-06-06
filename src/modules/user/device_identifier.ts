import { Request } from 'express';

export const getDeviceIdentifier = (req: Request): string => {
  if (req.headers['X-Forwarded-For'])
    return req.headers['X-Forwarded-For'].toString().split(',')[0];

  return req.ips[0] ?? req.ip;
};
