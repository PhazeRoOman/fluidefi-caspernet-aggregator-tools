import {IBlockParser} from '../../interfaces';
import { BlockParserResult } from '../../types';
import {Loggable} from "../../lib/Loggable";
import {ILogger} from "../../interfaces/lib/ILogger";
import {IAlerts} from "../../interfaces/lib/IAlerts";

/**
 * The IBlockParser implementation for preparing the block fields returned from a Casper Network node
 * in an acceptable format to write to the SQL data store.
 */
export class BlockParser extends Loggable implements IBlockParser {
  /**
   * @param {ILogger} logger property used for delegation of routing logs
   * @param {IAlerts} alerts property used for delegation of sending alerts
   */
  constructor(
    logger?: ILogger,
    alerts?: IAlerts
  ) {
    super(logger, alerts);
  }
  
  /**
   * Parses the fields from the raw block into an object that can be written to the data store.
   * @param block raw block fetched from the blockchain
   */
  apply(block: any): BlockParserResult {
    try {
      const fields = {
        blockHash: block.block.hash,
        parentHash: block.block.header.parent_hash,
        stateRootHash: block.block.header.state_root_hash,
        bodyHash: block.block.header.body_hash,
        randomBit: block.block.header.random_bit,
        accumulatedSeed: block.block.header.accumulated_seed,
        eraEnd: !!block.block.header.era_end,
        timestampUtc: block.block.header.timestamp,
        eraId: block.block.header.era_id,
        blockNumber: block.block.header.height,
        protocolVersion: block.block.header.protocol_version,
        proposer: block.block.body.proposer,
        deployHashes: block.block.body.deploy_hashes,
        transferHashes: block.block.body.transfer_hashes,
        apiVersion: block.api_version,
      };

      return { success: true, fields }
    } catch (e: any) {
      const message = `Failed to parse block`;
      this.error(message, e);
  
      return {
        success: false,
        error: e,
        message,
      }
    }
  }
}
