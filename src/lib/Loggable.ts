import {ILogger} from "../interfaces/lib/ILogger";
import {ConsoleLogger} from "./ConsoleLogger";
import {IAlerts} from "../interfaces/lib/IAlerts";

/**
 * The base class for the library, mainly responsible for handling logging and alerts.
 */
export abstract class Loggable {
  logger: ILogger;
  alerts?: IAlerts;
  disableLogger?: boolean;
  name = (this as any).constructor.name;
  
  /**
   * @param {ILogger} logger property used for delegation of routing logs
   * @param {IAlerts} alerts property used for delegation of sending alerts
   * @param {boolean} disableLogger set to true to disable logger
   */
  protected constructor(
    logger?: ILogger,
    alerts?: IAlerts,
    disableLogger?: boolean
  ) {
    this.logger = logger || new ConsoleLogger();
    this.alerts = alerts;
    this.disableLogger = disableLogger;
  }
  
  /**
   * Saves / sends a log message at INFO level.
   * @param message message to log
   * @param sendAlert set to true if sending alert is desired
   * @param position block height of current process
   */
  info(message: string, sendAlert = false, position?: number): void {
    if(this.disableLogger) { return; }
    
    this.logger.info(
      message,
      this.name,
      position
    );
    
    if(sendAlert && this.alerts) {
      this.alerts.info(
        message,
        this.name,
        position
      );
    }
  }
  
  /**
   * Saves / sends a log message at WARN level.
   * @param message message to log
   * @param sendAlert set to true if sending alert is desired
   * @param position block height of current process
   */
  warn(message: string, sendAlert = false, position?: number): void {
    if(this.disableLogger) { return; }
    
    this.logger.warn(
      message,
      this.name,
      position
    );
  
    if(sendAlert && this.alerts) {
      this.alerts.info(
        message,
        this.name,
        position
      );
    }
  }
  
  /**
   * Saves / sends a log message at DEBUG level.
   * @param message message to log
   * @param position block height of current process
   */
  debug(message: string, position?: number): void {
    if(this.disableLogger) { return; }
    
    this.logger.debug(
      message,
      this.name,
      position
    );
  }
  
  /**
   * Saves / sends a log message at ERROR level.
   * @param message message to log
   * @param error error object, if any
   * @param sendAlert set to true if sending alert is desired
   * @param position block height of current process
   */
  error(
    message: string,
    error?: Error,
    sendAlert = false,
    position?: number
  ): void {
    if(this.disableLogger) { return; }
    
    this.logger.error(
      message,
      this.name,
      position,
      error && error.stack ? error.stack : undefined
    );
  
    if(sendAlert && this.alerts) {
      this.alerts.error(
        message,
        this.name,
        position
      );
    }
  }
}
