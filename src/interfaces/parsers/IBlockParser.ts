import { BlockParserResult } from '../../types';

export interface IBlockParser {
  /**
   * Parses the block fetched for the blockchain and returns the data in a format that can be saved in the data store
   * @param block raw block fetched from the blockchain
   */
  apply(block: object): BlockParserResult;
}
