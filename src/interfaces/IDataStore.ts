import { ReadQueryResult, WriteQueryResult } from '../types';

export interface IDataStore {
  /**
   * Reads data from the data store.
   * @param query read query to execute on the data store
   * @param values array of variables to substitute into the query, if required
   */
  read(query: string, values: any[]): Promise<ReadQueryResult>;

  /**
   * Writes data to the data store.
   * @param query write query to execute on the data store
   * @param values array of variables to substitute into the query, if required
   */
  write(query: string, values: any[]): Promise<WriteQueryResult>;
}
