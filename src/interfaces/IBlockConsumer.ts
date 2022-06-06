import { BlockConsumerResult } from '../types/services';

export interface IBlockConsumer {
  apply(height: number): Promise<BlockConsumerResult>;
}
