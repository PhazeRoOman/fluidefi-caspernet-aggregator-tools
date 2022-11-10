import { IBlockFetcher } from '../../src';
import { BlockFetcherResult } from '../../src';

export class MockBlockFetcher implements IBlockFetcher {
  private blocks!: any[];

  constructor() {
    this.blocks = [];
  }

  injectBlocks(blocks: any[]): void {
    this.blocks = blocks || [];
  }

  async apply(height: number): Promise<BlockFetcherResult> {
    if(!!this.blocks) {
      for (const block of this.blocks) {
        if (!!block && !!block.block && !!block.block.header && !!block.block.header.height) {
          const blockNumber= block.block.header.height;

          if(parseInt(blockNumber, 10) === height) {
            return { success: true, block, height }
          }
        }
      }
    }

    return { success: false, error: 'Block not found', height }
  }
}
