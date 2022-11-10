## Usage Overview

**This documentation describes the usage and provides the examples for the fl-casper-tools npm package.**

The package can be found [here](https://www.npmjs.com/package/fl-casper-tools) on npm's website.

### Objective

The purpose of the package is to provide a library of tools that can be composed together in to a data-aggregation app, with the goal of storing all caspernet raw and decoded DeFi data in an efficient data store.

An application using this library would perform ETL operations, on historical and new blockchain data as it is produced.  The types of data extracted and decoded would include:

- Block data (including header and body)
- Deploys (raw)
- DeFi data decoded from deploys:
  - Token approvals
  - Token transfers
  - Minting / burning of liquidity
  - Updates to liquidity pool reserves / asset pricing
  - Other operations for DeFi platforms deployed to Caspernet

The general flow for aggregating block data uses the following interfaces:

#### IBlockchain

A wrapper for the blockchain's JSON RPC client, only exposing the methods necessary to serve the purposes of the data aggregation.

#### IBlockFetcher

Has IBlockchain as a dependency, with which it uses to fetch a desired block by height.  Returns the following result:
```typescript
type BlockFetcherResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
  block?: any;
};
```

#### IBlockParser

Will parse and format the raw block returned from the blockchain and return an object that is acceptable to save to the data store.  Returns the following result:
```typescript
type BlockParserResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
  fields?: any;
};
```

#### IBlockSaver

Will save a new Block Entity to the data store.  Returns the following result:
```typescript
type SaveBlockResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
};
```

#### IDataStore

This is an interface for the data store, which has an implementation in the library which is a wrapper for the typeorm DataSource. It's main purpose is to initialize the DataSource, and retrieve Repositories for the supported Entities.

#### Return values

Each of the interfaces uses a return object for it's primary exposed method, which includes a boolean to specify whether the operation was successful or not.  If failed, it will also include any caught error messages in the error field of the result.  This provides an easy check that can be made by the application between each operation, to help determine the next course of action.

#### Example Usage

The following assumes you have already completed the installation outlined in `INSTALLATION.md`.
An example of how all the implementation classes are used together for a single block looks like this:

```javascript
// javascript example
// ==================

// import classes
const {
  CasperBlockchain,
  BlockFetcher,
  BlockParser,
  DataStore,
  BlockSaver,
} = require('fl-casper-tools');

const jsonRpcProviderUrl = 'rpc_endpoint_fpr_your_node';

// define the typeorm connection config options for your data source
const dataSourceOptions = {
  type: 'postgres',
  host: 'postgres_db_hostname',
  port: 5432,  // or port # you are using
  username: 'postgres_db_username',
  password: 'postgres_db_password',
  database: 'postgres_db_database_name',
  synchronize: false,
  logging: false,
  entities: [
    Block,
    ProcessLog,
  ],
  migrations: [],
  subscribers: [],
  extra: { max: maxPoolConnections },
}

// instantiate
const blockchain = new CasperBlockchain(jsonRpcProviderUrl);
const fetcher = new BlockFetcher(blockchain);
const parser = new BlockParser();
const datastore = new DataStore(getDataSource(dataSourceOptions));
const blockSaver = new BlockSaver(datastore);

// execute in async scope
(async () => {
  // Initialize the typeorm DataSource:
  await datastore.initialize();

  const targetBlockHeight = 700000;
  
  // fetch the block
  const blockFetcherResult = await fetcher.apply(targetBlockHeight);

  // if the block fetcher was successful, the 'block' field in the result will be defined
  const block = blockFetcherResult.block;
  
  // parse the fields from the raw block to match the format of the data store
  const parserResult = parser.apply(block);
  
  // if the block parser was successful, the 'fields' field of the result will be defined
  const fields = parserResult.fields;
  
  // save the block to the data store
  const result = await blockSaver.apply(fields);
  
  // check that the block was saved successfully
  if(result.success) {
    console.log(`Block ${targetBlockHeight} was saved successfully!`);
  }
})()
  .catch((e) => {
    console.log(e);
  });
```

Notes on the above:

- Additional checks would be made between each step that the result from the previous step was successful, using the result.success field. This would prompt retries or error-handling.
- Any of the classes instantiated could be replaced by a user-defined implementation that respects the interface, for example:
```javascript
const parser = new MyBlockParser();
const blockSaver = new MyMongoBlockSaver();
```

```typescript
// typescript example
// ==================

// import classes / interfaces / types
import {
  CasperBlockchain,
  BlockFetcher,
  BlockParser,
  DataStore,
  BlockSaver,
  IBlockchain,
  IBlockFetcher,
  IBlockParser,
  IBlockSaver,
  IDataStore,
  BlockFetcherResult,
  BlockParserResult,
  SaveBlockResult,
} from 'fl-casper-tools';

const jsonRpcProviderUrl: string = 'rpc_endpoint_fpr_your_node';

// define the typeorm connection config options for your data source
const dataSourceOptions = {
  type: 'postgres',
  host: 'postgres_db_hostname',
  port: 5432,  // or port # you are using
  username: 'postgres_db_username',
  password: 'postgres_db_password',
  database: 'postgres_db_database_name',
  synchronize: false,
  logging: false,
  entities: [
    Block,
    ProcessLog,
  ],
  migrations: [],
  subscribers: [],
  extra: { max: maxPoolConnections },
}

// instantiate
const blockchain: IBlockchain = new CasperBlockchain(jsonRpcProviderUrl);
const fetcher: IBlockFetcher = new BlockFetcher(blockchain);
const parser: IBlockParser = new BlockParser();
const datastore: IDataStore = new DataStore(getDataSource(dataSourceOptions));
const blockSaver: IBlockSaver = new BlockSaver(datastore);

// execute in async scope
(async () => {
  // Initialize the typeorm DataSource:
  await datastore.initialize();
  
  const targetBlockHeight: number = 700000;
  
  // fetch the block
  const blockFetcherResult: BlockFetcherResult = await fetcher.apply(targetBlockHeight);
  
  // check for success
  if(!blockFetcherResult.success) {
    console.log('BlockFetcher was unsuccessful');
    console.log(blockFetcherResult);
    return;
  }

  // if the block fetcher was successful, the 'block' field in the result will be defined
  const block: any = blockFetcherResult.block;
  
  // parse the fields from the raw block to match the format of the data store
  const parserResult: BlockParserResult = parser.apply(block);

  // check for success
  if(!parserResult.success) {
    console.log('BlockParser was unsuccessful');
    console.log(parserResult);
    return;
  }
  
  // if the block parser was successful, the 'fields' field of the result will be defined
  const fields: any = parserResult.fields;
  
  // save the block to the data store
  const result: SaveBlockResult = await blockSaver.apply(fields);
  
  // check that the block was saved successfully
  if(result.success) {
    console.log(`Block ${targetBlockHeight} was saved successfully!`);
  } else {
    console.log('Block  was unsuccessful');
    console.log(`Block ${targetBlockHeight} was not saved successfully`);
    return;
  }
})()
  .catch((e) => {
    console.log(e);
  });
```

#### IBlockConsumer

The above process can be simplified using the library's implementation of the BlockConsumer, which is abstraction for all the steps above, and checks for success or failure after each step.
Returns the following result:
```typescript
type BlockConsumerResult = {
  success: boolean;
  error?: any;
  message?: string;
  height?: number;
};
```

An example using the IBlockConsumer in javascript would look like:

```javascript
// import classes
const {
  CasperBlockchain,
  BlockFetcher,
  BlockParser,
  DataStore,
  BlockSaver,
  BlockConsumer,
} = require('fl-casper-tools');

const jsonRpcProviderUrl = 'rpc_endpoint_fpr_your_node';

// define the typeorm connection config options for your data source
const dataSourceOptions = {
  type: 'postgres',
  host: 'postgres_db_hostname',
  port: 5432,  // or port # you are using
  username: 'postgres_db_username',
  password: 'postgres_db_password',
  database: 'postgres_db_database_name',
  synchronize: false,
  logging: false,
  entities: [
    Block,
    ProcessLog,
  ],
  migrations: [],
  subscribers: [],
  extra: { max: maxPoolConnections },
}

// instantiate
const blockConsumer = new BlockConsumer(
  new BlockParser(),
  new BlockFetcher(new CasperBlockchain(jsonRpcProviderUrl)),
  new BlockSaver(new DataStore(getDataSource(dataSourceOptions)))
);

// execute in async scope
(async () => {
  // Initialize the typeorm DataSource:
  await datastore.initialize();
  
  const targetBlockHeight = 700000;
  
  // apply the block consumer to the target height
  const result = await blockConsumer.apply(targetBlockHeight);
  
  // check that the block was consumed successfully
  if(result.success) {
    console.log(`Block ${targetBlockHeight} was saved successfully!`);
  } else {
    console.log(`Block ${targetBlockHeight} was not saved successfully:`);
    console.log(result.error);
  }
})()
  .catch((e) => {
    console.log(e);
  });
```

The above process can be applied to all blocks in history, at whatever level of concurrency is desirable / feasible, to populate the data store with blocks.  Once the blockchain history has been written, a process will continue to save each new block that is added to the chain.

### Deploys

Coming soon.

### Token Events

Coming soon.

### AMM Liquidity Pool Events

Coming soon.
