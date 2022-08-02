import { expect } from 'chai';
import { BlockConsumer } from '../../../src/services/BlockConsumer';
import { IBlockConsumer } from '../../../src/interfaces/IBlockConsumer';
import { IBlockFetcher } from '../../../src/interfaces/IBlockFetcher';
import { IBlockParser } from '../../../src/interfaces/IBlockParser';
import {Blocks} from "../../../src/models/Blocks";
import {MockPostgresClient} from "../../mocks/MockPostgresClient";
import {IDataStore} from "../../../src/interfaces/IDataStore";
import {IBlocks} from "../../../src/interfaces/IBlocks";
import {createBlocksTableQuery, createProcessLogTableQuery} from "../../fixtures/queries";
import {IBlockchain} from "../../../src/interfaces/IBlockchain";
import {CasperBlockchain} from "../../../src/lib/CasperBlockchain";
import {BlockFetcher} from "../../../src/services/BlockFetcher";
import {BlockParser} from "../../../src/services/BlockParser";

describe('BlockConsumer', async () => {
  let blockConsumer: IBlockConsumer;

  before(async () => {
    const casperBlockchain: IBlockchain = new CasperBlockchain();
    const blockFetcher: IBlockFetcher = new BlockFetcher(casperBlockchain);
    const blockParser: IBlockParser = new BlockParser();
    const datastore: IDataStore = new MockPostgresClient();
    const blocksModel: IBlocks = new Blocks(datastore);
    await datastore.write(createBlocksTableQuery, []);
    await datastore.write(createProcessLogTableQuery, []);

    blockConsumer = new BlockConsumer(
      blockParser,
      blockFetcher,
      blocksModel
    );
  });

  describe('#apply', async () => {
    const validTestCases: any[] = [
      785910,
      785911,
      785912,
      785913,
      785914,
    ];

    const invalidTestCases: any[] = [
      -1,
      999999999
      -55,
      'abc'
    ];

    validTestCases.forEach((height) => {
      it(`should consume block for valid height of ${height}`, async () => {
        const result = await blockConsumer.apply(height);
        expect(!!result).to.eql(true);
        expect(!!result.success).to.eql(true);
        expect(!!result.error).to.eql(false);
      });
    });

    invalidTestCases.forEach((height) => {
      it(`should not consume block for invalid height of ${height}`, async () => {
        const result = await blockConsumer.apply(height);
        expect(!!result).to.eql(true);
        expect(!!result.success).to.eql(false);
        expect(!!result.error).to.eql(true);
      });
    });
  });
});
