import { GetBlockResult } from '../types/lib';

export interface IBlockchain {
  getBlockByHeight(height: number): Promise<GetBlockResult>;
  getCurrentBlockHeight(): Promise<number | undefined>;
}
