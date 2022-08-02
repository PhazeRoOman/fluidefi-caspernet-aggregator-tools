import {IMemoryDb, newDb} from 'pg-mem';
import {IDataStore} from '../../src/interfaces/IDataStore';
import {ReadQueryResult, WriteQueryResult} from '../../src/types/services';

export class MockPostgresClient implements IDataStore {
  private db: IMemoryDb;
  private mode!: string;

  constructor() {
    this.db = newDb();
    this.activateSuccessOnlyMode();
  }

  activateSuccessOnlyMode(): void {
    this.mode = 'success';
  }

  activateFailureOnlyMode(): void {
    this.mode = 'failure';
  }

  activateRandomizeMode(): void {
    this.mode = 'random';
  }

  getSuccess(): boolean {
    if(this.mode === 'success') {
      return true;
    } else if(this.mode === 'failure') {
      return false;
    }

    const value = Math.random();
    return value > 0.2;
  }

  getQueryString(query: string, values: any[]): string {
    for (let i = 0; i < values.length; i++) {
      if (Array.isArray(values[i])) {
        query = query.replace(`$${(i+1)}`,`ARRAY ['${values[i]}']`.replace(",","','"));
      } else if(typeof(values[i]) === 'string') {
        query = query.replace(`$${(i+1)}`,`'${values[i]}'`);
      } else {
        query = query.replace(`$${(i+1)}`,`${values[i]}`);
      }
    }

    return query;
  }

  async write(query: string, values: any[]): Promise<WriteQueryResult> {
    let queryResult: WriteQueryResult = { success: false };

    if(this.getSuccess()) {
      try{
        let formattedQuery: string = this.getQueryString(query, values);
        this.db.public.none(formattedQuery);
        queryResult.success = true;
      } catch(err) {
        queryResult.error = err.toString();
        queryResult.success = false;
      }
    }

    return queryResult;
  }

  async read(query: string, values: any[]): Promise<ReadQueryResult> {
    let queryResult: ReadQueryResult = { success: false };

    if(this.getSuccess()) {
      try {
        const formattedQuery: string = this.getQueryString(query, values);
        queryResult.result = this.db.public.many(formattedQuery);
        queryResult.success = true;
      } catch(err) {
        queryResult.error = err.toString();
        queryResult.success = false;
      }
    }

    return queryResult;
  }
}
