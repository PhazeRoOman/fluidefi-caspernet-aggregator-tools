import { IBlockchain } from '../interfaces';
import { IBlockFetcher } from '../interfaces';
import { BlockFetcherResult } from '../types';

/**
 * The IBlockFetcher implementation for fetching a single block by height from the given blockchain.
 * This class is blockchain-agnostic and only requires that the given blockchain is an implementation of IBlockchain.
 */
export class BlockFetcher implements IBlockFetcher {
  protected blockchain!: IBlockchain;

  /**
   * @param {IBlockchain} blockchain
   */
  constructor(blockchain: IBlockchain) {
    this.blockchain = blockchain;
  }

  /**
   * Fetches the block, if it exists, for the given height by calling the blockchain member's getBlockByHeight method.
   * @param height height of desired block
   */
  async apply(height: number): Promise<BlockFetcherResult> {
    const result = await this.blockchain.getBlockByHeight(height);

    return {
      success: result.success,
      error: result.error,
      height,
      block: result.block,
    };
  }
}
