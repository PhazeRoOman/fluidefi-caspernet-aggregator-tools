import {
  ReadQueryResult,
  WriteQueryResult
} from '../types/services';

export interface IDataStore {
  read(query: string, values: any[]): Promise<ReadQueryResult>;
  write(query: string, values: any[]): Promise<WriteQueryResult>;
}
