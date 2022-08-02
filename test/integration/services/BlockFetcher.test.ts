import { expect } from 'chai';
import { BlockFetcher } from '../../../src/services/BlockFetcher';
import { CasperBlockchain } from '../../../src/lib/CasperBlockchain';
import { IBlockchain } from '../../../src/interfaces/IBlockchain';

describe('BlockFetcher', async () => {
  let blockFetcher: BlockFetcher;

  before(async () => {
    const casperBlockchain: IBlockchain = new CasperBlockchain();
    blockFetcher = new BlockFetcher(casperBlockchain);
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
      it(`should return a block for valid height of ${height}`, async () => {
        const result = await blockFetcher.apply(height);
        expect(!!result).to.eql(true);
        expect(!!result.success).to.eql(true);
        expect(!!result.block).to.eql(true);
        expect(result.block.block.header.height === height).to.eql(true);
      });
    });

    invalidTestCases.forEach((height) => {
      it(`should not return a block for invalid height of ${height}`, async () => {
        const result = await blockFetcher.apply(height);
        expect(!!result).to.eql(true);
        expect(result.success).to.eql(false);
        expect(!!result.block).to.eql(false);
        expect(!!result.error).to.eql(true);
      });
    });
  });
});
