import {ILogger} from "../interfaces/lib/ILogger";

export class ConsoleLogger implements ILogger {
  info(
    message: string,
    service: string,
    position: number,
  ): void {
    // tslint:disable-next-line:no-console
    console.log(`[${new Date().toISOString()}] INFO [${service}] [${position}] ${message}`);
  }
  
  warn(
    message: string,
    service: string,
    position: number,
  ): void {
    // tslint:disable-next-line:no-console
    console.log(`[${new Date().toISOString()}] WARN [${service}] [${position}] ${message}`);
  }
  
  debug(
    message: string,
    service: string,
    position: number,
  ): void {
    // tslint:disable-next-line:no-console
    console.log(`[${new Date().toISOString()}] DEBUG [${service}] [${position}] ${message}`);
  }
  
  error(
    message: string,
    service?: string | undefined,
    position?: number | undefined,
    stack?: any
  ): void {
    // tslint:disable-next-line:no-console
    console.log(`[${new Date().toISOString()}] ERROR [${service}] [${position}] ${message}`);
    
    if(stack) {
      // tslint:disable-next-line:no-console
      console.log(stack);
    }
  }
}
