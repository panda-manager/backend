import { Request } from 'express';

export const APP_NAME = 'Panda Manager';

const retainLastOctet = (ip: string): string => {
  if (!ip) return '';

  const segments: string[] = ip.split('.');
  segments.pop();
  return segments.join('.') + '.0';
};

export const getDeviceIdentifier = (req: Request): string => {
  const { headers, ips, ip } = req;

  if (headers['X-Forwarded-For'])
    return retainLastOctet(headers['X-Forwarded-For'].toString().split(',')[0]);

  return retainLastOctet(ips[0] ?? ip);
};

export * from './responses/response.dto';
export * from './responses/error_response.dto';
