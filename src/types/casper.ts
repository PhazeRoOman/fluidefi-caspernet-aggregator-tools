export type CasperBlockFields = {
  blockHash: number;
  parentHash: string;
  stateRootHash: string;
  bodyHash: string;
  randomBit: string;
  accumulatedSeed: string;
  eraEnd: string;
  timestampUtc: string;
  eraId: string;
  blockHeight: string;
  protocolVersion: string;
  proposer: string;
  deployHashes: string;
  transferHashes: string;
};
