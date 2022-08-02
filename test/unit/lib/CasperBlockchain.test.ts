import { expect } from 'chai';
import { CasperBlockchain } from '../../../src/lib/CasperBlockchain';
import { IBlockchain } from '../../../src/interfaces/IBlockchain';

describe('CasperBlockchain', async () => {
  let casperBlockchain: IBlockchain;
  let height: number | undefined;

  before(() => {
    casperBlockchain = new CasperBlockchain();
  });

  describe('#getCurrentBlockHeight', async () => {
    it('should fetch the current block height', async () => {
      height = await casperBlockchain.getCurrentBlockHeight();
      console.log('Current height: ' + height);
      expect(!!height).to.eql(true);
      expect((height || 0) > 0).to.eql(true);
    });
  });

  describe('#getBlockByHeight', async () => {
    const validOffsets = [ 1, 2, 3 ];
    const invalidOffsets = [ -50, -60, -70 ];

    validOffsets.forEach((offset) => {
      it(`should fetch the block for the given height with offset ${offset}`, async () => {
        const heightToFetch = (height || 0) - offset;
        const result = await casperBlockchain.getBlockByHeight(heightToFetch);
        expect(!!result).to.eql(true);
        expect(result.success).to.eql(true);
        expect(result.block.block.header.height === heightToFetch).to.eql(true);
      });
    });

    invalidOffsets.forEach((offset) => {
      it(`should fail to fetch the block for the given height with offset ${offset}`, async () => {
        const heightToFetch = (height || 0) - offset;
        const result = await casperBlockchain.getBlockByHeight(heightToFetch);
        expect(!!result).to.eql(true);
        expect(result.success).to.eql(false);
        expect(!!result.block).to.eql(false);
        expect(!!result.error).to.eql(true);
      });
    });
  });
});
