import { expect } from 'chai';
import { Blocks } from '../../../src/models/Blocks';
import { MockPostgresClient } from '../../../test/mocks/MockPostgresClient';
import { modelTestCases } from '../../fixtures/blocks'
import {IDataStore} from "../../../src/interfaces/IDataStore";
import {createBlocksTableQuery, createProcessLogTableQuery} from "../../fixtures/queries";

describe('Blocks', async () => {
  let datastore: IDataStore,
    blocksModel: Blocks;

  before(async () => {
    datastore = new MockPostgresClient();
    blocksModel = new Blocks(datastore);
    await datastore.write(createBlocksTableQuery, []);
    await datastore.write(createProcessLogTableQuery, []);
  });

  describe('#create', async () => {
    it('should successfully write', async () => {
      const result = await blocksModel.create(modelTestCases[0]);
      expect(!!result.success).to.eql(true);
      expect(!!result.error).to.eql(false);
      expect(`${result.height}`).to.eql(`${modelTestCases[0].blockHeight}`);

    });

    it('should fail due to missing fields in data', async () => {
      const result = await blocksModel.create(modelTestCases[1]);
      expect(!!result.success).to.eql(false);
      expect(!!result.error).to.eql(true);
    });
  });

  describe('#findByHeight', async () => {
    it('should successfully read', async () => {
      await blocksModel.create(modelTestCases[2]);
      const result = await blocksModel.findByHeight(modelTestCases[0].blockHeight);
      expect(!!result.success).to.eql(true);
      expect(!!result.result).to.eql(true);
      expect(result.result.length > 0).to.eql(true);
      expect(!!result.error).to.eql(false);
    });

    it('should fail due to non-existent block number in db', async () => {
      const result = await blocksModel.findByHeight(-1);
      expect(!!result.success).to.eql(true);
      expect(result.result).to.eql([]);
      expect(!!result.error).to.eql(false);
    });
  });
});
