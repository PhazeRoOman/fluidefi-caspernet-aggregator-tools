export interface IAlerts {
  info(
    message: string,
    service: string,
    position?: number
  ): void;
  
  error(
    message: string,
    service: string,
    position?: number
  ): void;
}
