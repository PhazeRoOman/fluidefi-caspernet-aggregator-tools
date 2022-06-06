import { IBlockchain } from '../interfaces/IBlockchain';
import { GetBlockResult } from '../types/lib';
import { CasperServiceByJsonRPC } from 'casper-js-sdk';
import { settings } from '../config/settings';

export class CasperBlockchain implements IBlockchain {
  private client!: CasperServiceByJsonRPC;

  constructor() {
    this.client = new CasperServiceByJsonRPC(
      <string>settings.blockchain.providerUrl
    );
  }

  async getBlockByHeight(height: number): Promise<GetBlockResult> {
    let result: any,
      error: string;

    try {
      result = await this.client.getBlockInfoByHeight(height);
    } catch(e) {
      error = `Request failed with error: ${e.toString()}`;
    }

    return !!result
      ? { success: true, block: result, height: height }
      // @ts-ignore
      : { success: false, error: error, height: height }
  }

  async getCurrentBlockHeight(): Promise<number | undefined> {
    const result = await this.client.getLatestBlockInfo();
    return !!result && !!result.block ? result.block.header.height : undefined;
  }
}
