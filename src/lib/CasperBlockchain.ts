import { IBlockchain } from '../interfaces';
import { GetBlockResult } from '../types';
import { CasperServiceByJsonRPC } from 'casper-js-sdk';
import { settings } from '../config/settings';

export class CasperBlockchain implements IBlockchain {
  private client!: CasperServiceByJsonRPC;

  constructor() {
    this.client = new CasperServiceByJsonRPC(settings.blockchain.providerUrl as string);
  }

  async getBlockByHeight(height: number): Promise<GetBlockResult> {
    let result: any;
    let error: string;

    try {
      result = await this.client.getBlockInfoByHeight(height);
    } catch (e) {
      error = `Request failed with error: ${e.toString()}`;
    }

    return !!result
      ? { success: true, block: result, height }
      : // @ts-ignore
        { success: false, error, height };
  }

  async getCurrentBlockHeight(): Promise<number | undefined> {
    const result = await this.client.getLatestBlockInfo();
    return !!result && !!result.block ? result.block.header.height : undefined;
  }
}
