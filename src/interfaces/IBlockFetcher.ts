import { BlockFetcherResult } from '../types';

export interface IBlockFetcher {
  /**
   * Fetches a block using the IBlockchain dependency at the given height
   * @param height height of desired block
   */
  apply(height: number): Promise<BlockFetcherResult>;
}
