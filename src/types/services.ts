export type BlockConsumerResult = {
  success: boolean;
  error?: string;
  height?: number;
};

export type SaveBlockResult = {
  success: boolean;
  error?: string;
  height?: number;
};

export type BlockFetcherResult = {
  success: boolean;
  error?: string;
  height?: number;
  block?: any;
};

export type BlockParserResult = {
  success: boolean;
  error?: string;
  height?: number;
  fields?: any;
};

export type ReadQueryResult = {
  success: boolean;
  error?: string;
  result?: any[];
};

export type WriteQueryResult = {
  success: boolean;
  error?: string;
  result?: any[];
};
