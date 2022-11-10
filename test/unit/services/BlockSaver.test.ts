import {IDataStore, SaveBlockResult} from '../../../src';
import {IBlockSaver} from "../../../src/interfaces/datastore/IBlockSaver";
import {BlockSaver} from "../../../src/services/datastore/BlockSaver";
import {MockDataStore} from "../../mocks/MockDataStore";
import {invalidParsedBlocks, parsedBlocks} from "../../fixtures/blocks";
import {expect} from "chai";

describe('BlockSaver', async () => {
  let blockSaver: IBlockSaver;
  let datastore: IDataStore;
  
  before(async () => {
    datastore = new MockDataStore();
    blockSaver = new BlockSaver(datastore);
  });
  
  describe('#apply', async () => {
    parsedBlocks.forEach((block) => {
      it('should save a Block entity from valid fields', async () => {
        const result: SaveBlockResult = await blockSaver.apply(block);
        expect(!!result).to.eql(true);
        expect(!!result.success).to.eql(true);
      });
    });
  
    invalidParsedBlocks.forEach((block) => {
      it('should not save a Block entity from invalid fields', async () => {
        // @ts-ignore
        const result: SaveBlockResult = await blockSaver.apply(block);
        expect(!!result).to.eql(true);
        expect(!!result.success).to.eql(false);
      });
    });
  });
});
