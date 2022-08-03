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
      for(let i = 0; i < this.blocks.length; i++) {
        const block = this.blocks[i];

        if(!!block && !!block.block && !!block.block.header && !!block.block.header.height) {
          const blockHeight = block.block.header.height;

          if(parseInt(blockHeight) === height) {
            return { success: true, block: block, height: height }
          }
        }
      }
    }

    return { success: false, error: 'Block not found', height: height }
  }
}
