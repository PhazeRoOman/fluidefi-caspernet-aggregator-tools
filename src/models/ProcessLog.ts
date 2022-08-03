import { IDataStore } from '../interfaces';
import { FindProcessLogResult, CreateProcessLogResult, UpdateProcessLogResult } from '../types';

export type ProcessLogFields = {
  processName: string;
  subProcessName: string;
  blockNumber: number;
};

export class ProcessLog {
  protected datastore!: IDataStore;

  constructor(datastore: IDataStore) {
    this.datastore = datastore;
  }

  async create(fields: ProcessLogFields): Promise<CreateProcessLogResult> {
    const query = `
      insert into process_log (
        process_name,
        sub_process_name,
        block_number
      ) values ($1, $2, $3);
    `;

    const result = await this.datastore.write(query, [fields.processName, fields.subProcessName, fields.blockNumber]);

    return {
      success: result.success,
      processName: fields.processName,
      subProcessName: fields.subProcessName,
      error: result.error,
      result: result.result,
    };
  }

  async update(fields: ProcessLogFields): Promise<UpdateProcessLogResult> {
    const query = `  
      UPDATE process_log
      SET block_number = $1
      WHERE process_name = $2
      AND sub_process_name = $3;
    `;

    const result = await this.datastore.write(query, [fields.blockNumber, fields.processName, fields.subProcessName]);

    return {
      success: result.success,
      processName: fields.processName,
      subProcessName: fields.subProcessName,
      error: result.error,
      result: result.result,
    };
  }

  async find(processName: string, subProcessName: string): Promise<FindProcessLogResult> {
    const query = `
      select * from process_log
      where process_name = $1
      and sub_process_name = $2;
    `;

    const result = await this.datastore.read(query, [processName, subProcessName]);

    return {
      success: result.success,
      processName,
      subProcessName,
      error: result.error,
      result: result.result,
    };
  }

  async findAndReturnBlockNumber(processName: string, subProcessName: string): Promise<number | undefined> {
    const result = await this.find(processName, subProcessName);

    if (result.success && !!result.result && result.result.length > 0) {
      return result.result[0].block_number;
    }

    return undefined;
  }

  async findAndReturnLastProcessed(processName: string, subProcessName: string): Promise<string | undefined> {
    const result = await this.find(processName, subProcessName);

    if (result.success && !!result.result) {
      return result.result[0].last_processed;
    }

    return undefined;
  }
}
