import { IBlockchain } from '../interfaces';
import { GetBlockResult } from '../types';
import { CasperServiceByJsonRPC } from 'casper-js-sdk';
import {Loggable} from "./Loggable";
import {ILogger} from "../interfaces/lib/ILogger";
import {IAlerts} from "../interfaces/lib/IAlerts";

/**
 * The IBlockchain implementation for interacting with Casper Network
 */
export class CasperBlockchain extends Loggable implements IBlockchain {
  /**
   * Client used for sending JSON-RPC requests to the Casper node.
   * Requires the node's /rpc url as a constructor argument.
   *
   * [CasperServiceByJsonRPC](https://casper-ecosystem.github.io/casper-js-sdk/latest/modules/_services_casperservicebyjsonrpc_.html)
   */
  private client!: CasperServiceByJsonRPC;
  
  /**
   * @param providerUrl property used for delegation of routing logs
   * @param {ILogger} logger property used for delegation of routing logs
   * @param {IAlerts} alerts property used for delegation of sending alerts
   */
  constructor(
    providerUrl: string,
    logger?: ILogger,
    alerts?: IAlerts
  ) {
    super(logger, alerts);
    this.client = new CasperServiceByJsonRPC(providerUrl);
  }

  /**
   * Fetches the block, if it exists, for the given height using the Casper Network client.
   * @param height height of desired block
   */
  async getBlockByHeight(height: number): Promise<GetBlockResult> {
    try {
      const result = await this.client.getBlockInfoByHeight(height);
  
      return !!result
        ? { success: true, block: result, height }
        : { success: false, message: 'result undefined', height };
    } catch (e: any) {
      const message = `Failed to get block at height ${height}`;
      this.error(message, e);
      
      return {
        success: false,
        error: e,
        message,
        height
      }
    }
  }

  /**
   * Fetches the latest block height from the Casper Network client.
   */
  async getCurrentBlockHeight(): Promise<number | undefined> {
    try {
      const result = await this.client.getLatestBlockInfo();
      return !!result && !!result.block ? result.block.header.height : undefined;
    } catch(e: any) {
      this.error('Failed to get block height', e);
      return undefined;
    }
  }
}
