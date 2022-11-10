import { IBlockConsumer } from '../../interfaces';
import {BlockConsumerResult, BlockFetcherResult, BlockParserResult, SaveBlockResult} from '../../types';
import { IBlockFetcher } from '../../interfaces';
import { IBlockParser } from '../../interfaces';
import {Loggable} from "../../lib/Loggable";
import {ILogger} from "../../interfaces/lib/ILogger";
import {IAlerts} from "../../interfaces/lib/IAlerts";
import {IBlockSaver} from "../../interfaces/datastore/IBlockSaver";

/**
 * The IBlockConsumer implementation that is blockchain agnostic.
 * The sub-processors are passed as constructor arguments, and used to fetch,
 * parse and write a block at the given height.
 */
export class BlockConsumer extends Loggable implements IBlockConsumer {
  protected blockParser!: IBlockParser;
  protected blockFetcher!: IBlockFetcher;
  protected blockSaver!: IBlockSaver;

  /**
   * @param {IBlockParser} blockParser for delegation of parsing blocks
   * @param {IBlockFetcher} blockFetcher for delegation of fetching blocks
   * @param {IBlockSaver} blockSaver for saving blocks to the data store
   * @param {ILogger} logger property used for delegation of routing logs
   * @param {IAlerts} alerts property used for delegation of sending alerts
   */
  constructor(
    blockParser: IBlockParser,
    blockFetcher: IBlockFetcher,
    blockSaver: IBlockSaver,
    logger?: ILogger,
    alerts?: IAlerts
  ) {
    super(logger, alerts);
    this.blockParser = blockParser;
    this.blockFetcher = blockFetcher;
    this.blockSaver = blockSaver;
  }

  /**
   * Consumes a block at the given height, which includes fetching from provider, parsing and saving to datastore.
   * @param height height of desired block
   */
  async apply(height: number): Promise<BlockConsumerResult> {
    const result: BlockFetcherResult = await this.blockFetcher.apply(height);

    if (!result.success) {
      const message = `failed to fetch block at height ${height}`;
      this.error(message);
      return { success: false, message, height };
    }

    const blockParserResult: BlockParserResult = this.blockParser.apply(result.block);
    
    if(!blockParserResult.success) {
      const message = `failed to parse block at height ${height}`;
      this.error(message);
      return { success: false, message, height };
    }
  
    const saveBlockResult: SaveBlockResult = await this.blockSaver.apply(blockParserResult.fields);
  
    return {
      success: saveBlockResult.success,
      message: saveBlockResult.success ? undefined : `failed to save block at height ${height}`,
      error: saveBlockResult.error,
      height,
    };
  }
}
