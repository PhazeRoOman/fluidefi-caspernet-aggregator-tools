import { GetBlockResult } from '../../types';

export interface IBlockchain {
  /**
   * Fetches a block from the JSON-RPC provider at the given height
   * @param height height of desired block
   */
  getBlockByHeight(height: number): Promise<GetBlockResult>;

  /**
   * Fetches the latest block height known to the JSON-RPC provider
   */
  getCurrentBlockHeight(): Promise<number | undefined>;
}
