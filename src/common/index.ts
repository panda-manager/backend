import { Request } from 'express';

export const APP_NAME = 'Panda Manager';

const retainLastOctet = (ip: string): string => {
  if (!ip) return '';

  const segments: string[] = ip.split('.');

  if (segments.length > 1) {
    segments.pop();
    return segments.join('.') + '.0';
  }

  return ip;
};

export const getDeviceIdentifier = (req: Request): string => {
  const { headers, ips, ip } = req;

  if (headers['x-forwarded-for'])
    return retainLastOctet(headers['x-forwarded-for'].toString().split(',')[0]);

  return retainLastOctet(ips[0] ?? ip);
};

export * from './responses/response.dto';
export * from './responses/error_response.dto';

export type Mode = 'development' | 'production';
