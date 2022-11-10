// @ts-nocheck
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('blocks')
export class Block {
  @Column({ name: 'block_hash', type: 'varchar' })
  blockHash: string;
  
  @Column({ name: 'parent_hash', type: 'varchar' })
  parentHash: string;
  
  @Column({ name: 'state_root_hash', type: 'varchar' })
  stateRootHash: string;
  
  @Column({ name: 'body_hash', type: 'varchar' })
  bodyHash: string;
  
  @Column({ name: 'random_bit', type: 'boolean' })
  randomBit: boolean;
  
  @Column({ name: 'accumulated_seed', type: 'varchar' })
  accumulatedSeed: string;
  
  @Column({ name: 'era_end', type: 'boolean' })
  eraEnd: boolean;
  
  @Column({ name: 'timestamp_utc', type: 'timestamptz' })
  timestampUtc: Date;
  
  @Column({ name: 'era_id', type: 'integer' })
  eraId: number;
  
  @PrimaryColumn({ name: 'block_number', type: 'integer' })
  blockNumber: number;
  
  @Column({ name: 'protocol_version', type: 'varchar' })
  protocolVersion: string;
  
  @Column({ name: 'proposer', type: 'varchar' })
  proposer: string;
  
  @Column("varchar", { name: 'deploy_hashes', array: true })
  deployHashes: string[]
  
  @Column("varchar", { name: 'transfer_hashes', array: true })
  transferHashes: string[]
  
  @Column({ name: 'api_version', type: 'varchar' })
  apiVersion: string;
}
