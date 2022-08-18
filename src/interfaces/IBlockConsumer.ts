import { BlockConsumerResult } from '../types';

export interface IBlockConsumer {
  /**
   * Consumes a block at the given height, which includes fetching from provider, parsing and saving to datastore.
   * @param height height of desired block
   */
  apply(height: number): Promise<BlockConsumerResult>;
}
