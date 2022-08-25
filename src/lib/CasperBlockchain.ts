import { IBlockchain } from '../interfaces';
import { GetBlockResult } from '../types';
import { CasperServiceByJsonRPC } from 'casper-js-sdk';

/**
 * The IBlockchain implementation for interacting with Casper Network
 */
export class CasperBlockchain implements IBlockchain {
  /**
   * Client used for sending JSON-RPC requests to the Casper node.
   * Requires the node's /rpc url as a constructor argument.
   *
   * [CasperServiceByJsonRPC](https://casper-ecosystem.github.io/casper-js-sdk/latest/modules/_services_casperservicebyjsonrpc_.html)
   */
  private client!: CasperServiceByJsonRPC;

  constructor(providerUrl: string) {
    this.client = new CasperServiceByJsonRPC(providerUrl);
  }

  /**
   * Fetches the block, if it exists, for the given height using the Casper Network client.
   * @param height height of desired block
   */
  async getBlockByHeight(height: number): Promise<GetBlockResult> {
    let result: any;
    let error: string;

    try {
      result = await this.client.getBlockInfoByHeight(height);
    } catch (e: any) {
      error = `Request failed with error: ${e.toString()}`;
    }

    return !!result
      ? { success: true, block: result, height }
      : // @ts-ignore
        { success: false, error, height };
  }

  /**
   * Fetches the latest block height from the Casper Network client.
   */
  async getCurrentBlockHeight(): Promise<number | undefined> {
    const result = await this.client.getLatestBlockInfo();
    return !!result && !!result.block ? result.block.header.height : undefined;
  }
}
