import {IBlockSaver} from "../../src/interfaces/datastore/IBlockSaver";
import {CasperBlockFields, SaveBlockResult} from "../../src";
import {areFieldsValid} from "../fixtures/helpers";
import {blockEntityFields} from "../fixtures/blocks";

export class MockBlockSaver implements IBlockSaver {
  async apply(fields: CasperBlockFields): Promise<SaveBlockResult> {
    const success = areFieldsValid(fields, blockEntityFields);
    
    return {
      success,
      message: success ? undefined : `failed to create block with fields: ${fields ? JSON.stringify(fields) : undefined}`,
      height: success ? fields.blockNumber : undefined
    };
  }
}
