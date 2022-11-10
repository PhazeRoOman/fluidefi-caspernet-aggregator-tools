export type CasperBlockFields = {
  blockHash: string;
  parentHash: string;
  stateRootHash: string;
  bodyHash: string;
  randomBit: boolean;
  accumulatedSeed: string;
  eraEnd: boolean;
  timestampUtc: Date | string;
  eraId: number;
  blockNumber: number;
  protocolVersion: string;
  proposer: string;
  deployHashes: string[];
  transferHashes: string[];
  apiVersion: string;
};
