import { IBlockchain } from '../interfaces/IBlockchain';
import { IBlockFetcher } from '../interfaces/IBlockFetcher';
import { BlockFetcherResult } from '../types/services';

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
      height: height,
      block: result.block
    }
  }
}
