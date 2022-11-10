export interface ILogger {
  /**
   * Saves / sends a log message at INFO level.
   * @param message message to log
   * @param service name of service that generated the log message
   * @param position block height of current process
   */
  info(
    message: string,
    service?: string,
    position?: number
  ): void;
  
  /**
   * Saves / sends a log message at WARN level.
   * @param message message to log
   * @param service name of service that generated the log message
   * @param position block height of current process
   */
  warn(
    message: string,
    service?: string,
    position?: number
  ): void;
  
  /**
   * Saves / sends a log message at DEBUG level.
   * @param message message to log
   * @param service name of service that generated the log message
   * @param position block height of current process
   */
  debug(
    message: string,
    service?: string,
    position?: number
  ): void;
  
  /**
   * Saves / sends a log message at ERROR level.
   * @param message message to log
   * @param service name of service that generated the log message
   * @param position block height of current process
   * @param stack error stack trace, if any
   */
  error(
    message: string,
    service?: string,
    position?: number,
    stack?: any
  ): void;
}
