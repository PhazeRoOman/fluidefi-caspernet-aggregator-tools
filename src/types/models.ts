export type CreateBlockResult = {
  success: boolean;
  height?: number;
  error?: string;
}

export type FindBlockResult = {
  success: boolean;
  height?: number;
  error?: string;
  result?: any;
}

export type CreateProcessLogResult = {
  success: boolean;
  processName: string;
  subProcessName: string;
  error?: string;
  result?: any;
}

export type UpdateProcessLogResult = {
  success: boolean;
  processName: string;
  subProcessName: string;
  error?: string;
  result?: any;
}

export type FindProcessLogResult = {
  success: boolean;
  processName: string;
  subProcessName: string;
  error?: string;
  result?: any;
}
