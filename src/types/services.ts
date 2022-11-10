export type BlockConsumerResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
};

export type SaveBlockResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
};

export type BlockFetcherResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
  block?: any;
};

export type BlockParserResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
  fields?: any;
};
