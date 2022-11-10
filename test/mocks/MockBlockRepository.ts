import {Block} from "../../src/entities/Block";
import {IRepository} from "../../src/interfaces/datastore/IRepository";
import {CasperBlockFields} from "../../src";
import {blockEntityFields} from "../fixtures/blocks";
import {areFieldsValid} from "../fixtures/helpers";

export class MockBlockRepository implements IRepository {
  protected records: Block[] = [];
  
  create(fields: CasperBlockFields): Block | undefined {
    return areFieldsValid(fields, blockEntityFields) ? fields as Block : undefined;
  }
  
  async save(entity: Block): Promise<void> {
    if(areFieldsValid(entity, blockEntityFields)) {
      this.records.push(entity);
    } else {
      throw new Error('invalid entity!');
    }
  }
}
