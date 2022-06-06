import { BlockFetcherResult } from '../types/services';

export interface IBlockFetcher {
  apply(height: number): Promise<BlockFetcherResult>;
}
