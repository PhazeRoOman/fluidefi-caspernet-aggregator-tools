import { Logger, createLogger, transports } from 'winston';

export function getLogger(): Logger {
  return createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [new transports.Console()],
  });
}
