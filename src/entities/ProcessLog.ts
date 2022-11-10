// @ts-nocheck
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('process_log')
export class ProcessLog {
  @PrimaryColumn('integer', { generated: true })
  id: number;
  
  @Column({ name: 'process_name', type: 'varchar' })
  processName: string;
  
  @Column({ name: 'block_number', type: 'integer' })
  blockNumber: number;
  
  @Column({ name: 'start_block_number', type: 'integer' })
  startBlockNumber: number;
  
  @Column({ name: 'end_block_number', type: 'integer' })
  endBlockNumber: number;
  
  @Column({ name: 'timestamp_utc', type: 'timestamptz' })
  timestampUtc: Date;
  
  @Column({ name: 'last_processed', type: 'timestamptz' })
  lastProcessed: Date;
}
