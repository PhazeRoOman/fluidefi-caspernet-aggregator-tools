import { expect } from 'chai';
import { BlockConsumer } from '../../../src';
import { IBlockConsumer } from '../../../src';
import { IBlockFetcher } from '../../../src';
import { IBlockParser } from '../../../src';
import { blocks, parsedBlocks } from '../../fixtures/blocks';
import {MockBlockFetcher} from "../../mocks/MockBlockFetcher";
import {MockBlockParser} from "../../mocks/MockBlockParser";
import {IBlockSaver} from "../../../src/interfaces/datastore/IBlockSaver";
import {MockBlockSaver} from "../../mocks/MockBlockSaver";

describe('BlockConsumer', async () => {
  let blockConsumer: IBlockConsumer;

  before(async () => {
    const blockFetcher: IBlockFetcher = new MockBlockFetcher();
    (blockFetcher as MockBlockFetcher).injectBlocks(blocks);
    const blockParser: IBlockParser = new MockBlockParser();
    (blockParser as MockBlockParser).injectParsedBlocks(parsedBlocks);
    const blockSaver: IBlockSaver = new MockBlockSaver();

    blockConsumer = new BlockConsumer(
      blockParser,
      blockFetcher,
      blockSaver
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
      });
    });
  });
});
