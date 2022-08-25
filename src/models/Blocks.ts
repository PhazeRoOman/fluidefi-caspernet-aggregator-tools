import { IDataStore } from '../interfaces';
import { IBlocks } from '../interfaces';
import { CreateBlockResult, FindBlockResult } from '../types';

/**
 * The IBlocks implementation for storing Casper Network blocks in an SQL-based data store.
 */
export class Blocks implements IBlocks {
  protected datastore!: IDataStore;

  constructor(datastore: IDataStore) {
    this.datastore = datastore;
  }

  /**
   * Saves the block fields to the data store.
   * @param fields block data in a format that is compatible with the IDataStore dependency
   */
  async create(fields: any): Promise<CreateBlockResult> {
    const query = `
      insert into blocks (
        block_hash,
        parent_hash,
        state_root_hash,
        body_hash,
        random_bit,
        accumulated_seed,
        era_end,
        timestamp_utc,
        era_id,
        block_height,
        protocol_version,
        proposer,
        deploy_hashes,
        transfer_hashes,
        api_version
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `;

    const result = await this.datastore.write(query, [
      fields.blockHash,
      fields.parentHash,
      fields.stateRootHash,
      fields.bodyHash,
      fields.randomBit,
      fields.accumulatedSeed,
      fields.eraEnd,
      fields.timestampUtc,
      fields.eraId,
      fields.blockHeight,
      fields.protocolVersion,
      fields.proposer,
      fields.deployHashes,
      fields.transferHashes,
      fields.apiVersion,
    ]);

    return {
      success: result.success,
      height: fields.blockHeight,
      error: result.error,
    };
  }

  /**
   * Finds and returns the block fields from the datastore for the given height.
   * @param height height of desired block
   */
  async findByHeight(height: number): Promise<FindBlockResult> {
    const query = `
      select * from blocks
      where block_height = $1;
    `;

    const result = await this.datastore.read(query, [height]);

    return {
      success: result.success,
      height,
      error: result.error,
      result: result.result,
    };
  }

  async findAll(): Promise<FindBlockResult> {
    const query = `
      select * from blocks
    `;

    const result = await this.datastore.read(query, []);

    return {
      success: result.success,
      error: result.error,
      result: result.result,
    };
  }
}
