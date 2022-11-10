import {CasperBlockFields, SaveBlockResult} from "../../types";

export interface IBlockSaver {
  /**
   * Saves a new block to the data store for the given fields
   * @param fields parsed fields from a raw Caspernet block
   */
  apply(fields: CasperBlockFields): Promise<SaveBlockResult>;
}
