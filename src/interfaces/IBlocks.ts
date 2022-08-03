import { CreateBlockResult, FindBlockResult } from '../types/models';

export interface IBlocks {
  create(fields: object): Promise<CreateBlockResult>;
  findByHeight(height: number): Promise<FindBlockResult>;
}
