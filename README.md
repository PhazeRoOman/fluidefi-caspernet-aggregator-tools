## FLUIDEFI Caspernet Aggregator Tools

### Description

Classes and types that can be composed into systems for aggregating and storing AMM data produced by Casper Network.

### Installation

Install the package with:

```
npm install fl-casper-tools
```

### Usage

Import (javascript):

```javascript
const { 
  CasperBlockchain, 
  BlockFetcher,
  BlockParser,
  Blocks,
  PostgresClient,
  BlockConsumer,
} = require('fl-casper-tools');
```

Import (typescript):

```javascript
import { 
  CasperBlockchain, 
  BlockFetcher,
  BlockParser,
  Blocks,
  PostgresClient,
  BlockConsumer,
} from 'fl-casper-tools';
```

CasperBlockchain is a very light wrapper for the casper-sdk, which will only contain methods necessary for the data aggregation processes.

Create an instance by passing your JSON-RPC url to the constructor.  This should point to port 7777/rpc on your node server.

```javascript
const blockchain = new CasperBlockchain(jsonRpcProviderUrl);
```

Simple example - get the current blockchain height:
```javascript
const height = await blockchain.getCurrentBlockHeight();
```

The following example assumes you already have a postgres data source with the blocks table created, as per the schema in src/schema/...Raw Events.pdf.

The `writeOptions` argument for the PostgresClient will be the same options used for a `node-pg` Client.

Initialize other classes used for processing blocks:

```javascript
const fetcher = new BlockFetcher(blockchain);
const parser = new BlockParser();
const datastore = new PostgresClient(writeOptions);
const blocks = new Blocks(datastore);
```

You can now fetch a block, parse it and add to your data store:

```javascript
const blockFetcherResult = await fetcher.apply(700000);
```

The result will have the following fields:

```typescript
type BlockFetcherResult = {
  success: boolean;
  error?: string;
  height?: number;
  block?: any;
};
```

If the request failed or encountered an error, success will be false and an error message may be present.

Parse the block resulting in fields that map to the block model in the data store:

```javascript
const block = blockFetcherResult.block;
const parserResult = parser.apply(block);
```

The result will have the following fields, similar to the BlockFetcherResult:

```typescript
type BlockParserResult = {
  success: boolean;
  error?: string;
  height?: number;
  fields?: any;
};
```

If the parser was successful, save the block to the datastore using the blocks model:

```javascript
const fields = parserResult.fields;
const result = await blocks.create(fields);
```

The full process can be abstracted by using the BlockConsumer:

```javascript
const blockConsumer = new BlockConsumer(
  parser,
  fetcher,
  blocks
);

const blockConsumerResult = await blockConsumer.apply(700000);
```

The result will have the following fields:

```typescript
type BlockConsumerResult = {
  success: boolean;
  error?: string;
  height?: number;
};
```

You can define your own data store to pass to the Blocks model constructor, if you aren't using postgres. It just needs to implement the IDataStore interface.

Similarly, you can define your own Blocks model, if you are not using an SQL-based data store. It just needs to implement the IBlocks interface.

Note: A future release will allow for interoperability with inversify's dependency injection.

### Docs

Docs can be generated using typedoc and served locally via the docs directory.
Follow the  [typedocs installation instructions](https://typedoc.org/guides/installation/), and then generate docs with:
```
typedoc --out docs src/index.ts
```
