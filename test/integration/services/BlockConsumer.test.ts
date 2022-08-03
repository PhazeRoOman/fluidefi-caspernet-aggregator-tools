import { expect } from 'chai';
import { BlockConsumer } from '../../../src';
import { IBlockConsumer } from '../../../src';
import { IBlockFetcher } from '../../../src';
import { IBlockParser } from '../../../src';
import {Blocks} from '../../../src';
import {MockPostgresClient} from "../../mocks/MockPostgresClient";
import {IDataStore} from '../../../src';
import {IBlocks} from '../../../src';
import {createBlocksTableQuery, createProcessLogTableQuery} from "../../fixtures/queries";
import {IBlockchain} from '../../../src';
import {CasperBlockchain} from '../../../src';
import {BlockFetcher} from '../../../src';
import {BlockParser} from '../../../src';
import { settings } from '../../fixtures/settings';

describe('BlockConsumer', async () => {
  let blockConsumer: IBlockConsumer;

  before(async () => {
    const casperBlockchain: IBlockchain = new CasperBlockchain(settings.blockchain.providerUrl as string);
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
