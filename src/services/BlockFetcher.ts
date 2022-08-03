import { IBlockchain } from '../interfaces';
import { IBlockFetcher } from '../interfaces';
import { BlockFetcherResult } from '../types';

export class BlockFetcher implements IBlockFetcher {
  private blockchain!: IBlockchain;

  constructor(blockchain: IBlockchain) {
    this.blockchain = blockchain;
  }

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
