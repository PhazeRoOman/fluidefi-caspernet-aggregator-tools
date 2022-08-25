import { IBlockConsumer } from '../interfaces';
import { BlockConsumerResult, BlockParserResult, SaveBlockResult } from '../types';
import { IBlockFetcher } from '../interfaces';
import { IBlockParser } from '../interfaces';
import { IBlocks } from '../interfaces';

/**
 * The IBlockConsumer implementation that is blockchain agnostic.
 * The sub-processors are passed as constructor arguments, and used to fetch,
 * parse and write a block at the given height.
 */
export class BlockConsumer implements IBlockConsumer {
  protected blockParser!: IBlockParser;
  protected blockFetcher!: IBlockFetcher;
  protected blocks!: IBlocks;

  /**
   * @param {IBlockParser} blockParser implementation for the given blockchain
   * @param {IBlockFetcher} blockFetcher implementation for the given blockchain
   * @param {IBlocks} blocks implementation which is connected to the application's data store
   */
  constructor(blockParser: IBlockParser, blockFetcher: IBlockFetcher, blocks: IBlocks) {
    this.blockParser = blockParser;
    this.blockFetcher = blockFetcher;
    this.blocks = blocks;
  }

  /**
   * Consumes a block at the given height, which includes fetching from provider, parsing and saving to datastore.
   * @param height height of desired block
   */
  async apply(height: number): Promise<BlockConsumerResult> {
    const result = await this.blockFetcher.apply(height);

    if (!result.success) {
      return {
        success: false,
        error: 'No block returned',
        height,
      };
    }

    const blockParserResult: BlockParserResult = this.blockParser.apply(result.block);

    if (blockParserResult.success) {
      const saveBlockResult = await this.saveBlock(blockParserResult.fields);

      return {
        success: saveBlockResult.success,
        error: saveBlockResult.error,
        height,
      };
    } else {
      return {
        success: false,
        error: `Could not parse block: ${blockParserResult.error}`,
        height,
      };
    }
  }

  async saveBlock(blockFields: any[]): Promise<SaveBlockResult> {
    const result = await this.blocks.create(blockFields);

    return {
      success: result.success,
      error: result.error,
    };
  }
}
