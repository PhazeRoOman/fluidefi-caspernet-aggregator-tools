import { BlocksWorkerResult } from '../../types';

export interface IBlocksWorker {
  /**
   * Executes the logic for the worker, which should include determining which block(s) to consume and applying the necessary services
   */
  apply(): Promise<BlocksWorkerResult>;
}
