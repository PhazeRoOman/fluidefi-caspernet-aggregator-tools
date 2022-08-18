import { CreateBlockResult, FindBlockResult } from '../types';

export interface IBlocks {
  /**
   * Accepts the block data in an acceptable format and saves it in the data store
   * @param fields block data in a format that is compatible with the IDataStore dependency
   */
  create(fields: object): Promise<CreateBlockResult>;

  /**
   * Finds and returns the block entity for the given height from the IDataStore dependency
   * @param height height of desired block
   */
  findByHeight(height: number): Promise<FindBlockResult>;
}
