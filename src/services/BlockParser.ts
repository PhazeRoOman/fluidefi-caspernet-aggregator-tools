import { IBlockParser } from '../interfaces/IBlockParser';
import { BlockParserResult } from '../types';

export class BlockParser implements IBlockParser {
  apply(block: any): BlockParserResult {
    const parserResult: BlockParserResult = { success: false };

    try {
      parserResult.fields = {
        blockHash: block.block.hash,
        parentHash: block.block.header.parent_hash,
        stateRootHash: block.block.header.state_root_hash,
        bodyHash: block.block.header.body_hash,
        randomBit: block.block.header.random_bit,
        accumulatedSeed: block.block.header.accumulated_seed,
        eraEnd: !!block.block.header.era_end,
        timestampUtc: block.block.header.timestamp,
        eraId: block.block.header.era_id,
        blockHeight: block.block.header.height,
        protocolVersion: block.block.header.protocol_version,
        proposer: block.block.body.proposer,
        deployHashes: block.block.body.deploy_hashes,
        transferHashes: block.block.body.transfer_hashes,
        apiVersion: block.api_version,
      };

      parserResult.success = true;
    } catch (err) {
      // todo - log error
      // console.log(err);
      parserResult.error = err.toString();
      parserResult.success = false;
    }

    return parserResult;
  }
}
