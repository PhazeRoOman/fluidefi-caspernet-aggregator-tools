import { IBlockConsumer } from '../interfaces/IBlockConsumer';
import { BlockConsumerResult, BlockParserResult, SaveBlockResult } from '../types/services';
import { IBlockFetcher } from '../interfaces/IBlockFetcher';
import { IBlockParser } from '../interfaces/IBlockParser';
import {IBlocks} from '../interfaces/IBlocks';

export class BlockConsumer implements IBlockConsumer {
  private blockParser!: IBlockParser;
  private blockFetcher!: IBlockFetcher;
  private blocks!: IBlocks;

  constructor(
    blockParser: IBlockParser,
    blockFetcher: IBlockFetcher,
    blocks: IBlocks
  ) {
    this.blockParser = blockParser;
    this.blockFetcher = blockFetcher;
    this.blocks = blocks;
  }

  async apply(height: number): Promise<BlockConsumerResult> {
    const result = await this.blockFetcher.apply(height);

    if(!result.success) {
      return {
        success: false,
        error: 'No block returned',
        height: height
      };
    }

    const blockParserResult: BlockParserResult = this.blockParser.apply(result.block);

    if(blockParserResult.success) {
      const result = await this.saveBlock(blockParserResult.fields);

      return {
        success: result.success,
        error: result.error,
        height: height
      }
    } else {
      return {
        success: false,
        error: `Could not parse block: ${blockParserResult.error}`,
        height: height
      }
    }
  }

  async saveBlock(blockFields: any[]): Promise<SaveBlockResult> {
    const result = await this.blocks.create(blockFields);

    return {
      success: result.success,
      error: result.error
    };
  }
}
