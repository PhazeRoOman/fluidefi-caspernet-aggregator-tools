import { BlockParserResult } from '../types/services';

export interface IBlockParser {
  apply(block: object): BlockParserResult;
}
