import { IBlockchain } from '../../interfaces';
import { IBlockFetcher } from '../../interfaces';
import { BlockFetcherResult } from '../../types';
import {Loggable} from "../../lib/Loggable";
import {ILogger} from "../../interfaces/lib/ILogger";
import {IAlerts} from "../../interfaces/lib/IAlerts";

/**
 * The IBlockFetcher implementation for fetching a single block by height from the given blockchain.
 * This class is blockchain-agnostic and only requires that the given blockchain is an implementation of IBlockchain.
 */
export class BlockFetcher extends Loggable implements IBlockFetcher {
  protected blockchain!: IBlockchain;

  /**
   * @param {IBlockchain} blockchain
   * @param {ILogger} logger property used for delegation of routing logs
   * @param {IAlerts} alerts property used for delegation of sending alerts
   */
  constructor(
    blockchain: IBlockchain,
    logger?: ILogger,
    alerts?: IAlerts
  ) {
    super(logger, alerts);
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
      message: result.message,
      height,
      block: result.block,
    };
  }
}
