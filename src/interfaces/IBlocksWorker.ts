import { BlocksWorkerResult } from '../types/workers';

export interface IBlocksWorker {
  apply(): Promise<BlocksWorkerResult>;
}
