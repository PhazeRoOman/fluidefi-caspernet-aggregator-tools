import { expect } from 'chai';
import {blockEntityFields, blocks, invalidBlocks} from '../../fixtures/blocks';
import { BlockParser } from '../../../src';
import {areFieldsValid} from "../../fixtures/helpers";

describe('BlockParser', async () => {
  let blockParser: BlockParser;

  before( async () => {
    blockParser = new BlockParser();
  });

  describe('#apply', async () => {
    blocks.forEach((block) => {
      it('should not return error while parsing valid data', async () => {
        const result = await blockParser.apply(block);
        expect(!!result).to.eql(true);
        expect(!!result.success).to.eql(true);
        expect(!!result.fields).to.eql(true);
        expect(result.fields.blockHash).to.eql(block.block.hash);
        expect(result.fields.parentHash).to.eql(block.block.header.parent_hash);
        expect(result.fields.stateRootHash).to.eql(block.block.header.state_root_hash);
        expect(result.fields.bodyHash).to.eql(block.block.header.body_hash);
        expect(result.fields.randomBit).to.eql(block.block.header.random_bit);
        expect(result.fields.accumulatedSeed).to.eql(block.block.header.accumulated_seed);
        expect(!!result.fields.eraEnd).to.eql(!!block.block.header.era_end);
        expect(result.fields.timestampUtc).to.eql(block.block.header.timestamp);
        expect(result.fields.eraId).to.eql(block.block.header.era_id);
        expect(result.fields.blockNumber).to.eql(block.block.header.height);
        expect(result.fields.protocolVersion).to.eql(block.block.header.protocol_version);
        expect(result.fields.proposer).to.eql(block.block.body.proposer);
        expect(result.fields.deployHashes).to.eql(block.block.body.deploy_hashes);
        expect(result.fields.transferHashes).to.eql(block.block.body.transfer_hashes);
        expect(areFieldsValid(result.fields, blockEntityFields)).to.eql(true);
      });
    });
  
    invalidBlocks.forEach((block) => {
      it('should return error while parsing invalid data', async () => {
        const result = await blockParser.apply(block);
        expect(!!result).to.eql(true);
        expect(!!result.success).to.eql(false);
        expect(!!result.fields).to.eql(false);
        expect(!!result.error).to.eql(true);
        expect(areFieldsValid(result.fields, blockEntityFields)).to.eql(false);
      });
    });
  });
});
