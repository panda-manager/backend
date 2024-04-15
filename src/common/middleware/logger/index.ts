import { Logger } from '@nestjs/common';

export const LoggerMiddleware = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  const currentTimestamp = new Date().toUTCString();

  Logger.log(
    `${currentTimestamp} [Request]: HTTP ${req.method} | resource: ${req.url}`,
  );

  Logger.log(
    `${currentTimestamp} [Response]: ${res.status.toString()} $${res.statusText}`,
  );
  next();
};
