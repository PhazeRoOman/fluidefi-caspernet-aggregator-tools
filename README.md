## FLUIDEFI Caspernet Aggregator Tools

This repository contains a library of tools that can be composed together into a data-aggregation app, with the goal of storing all desired caspernet raw and decoded DeFi data in an efficient data store.

An application using this library would perform ETL operations, on historical and new blockchain data as it is produced.  The types of data extracted and decoded will include:

- Block data (including header and body)
- Deploys (raw)
- DeFi data (decoded from state changes in deploys):
    - Token approvals
    - Token transfers
    - Minting / burning of liquidity
    - Updates to liquidity pool reserves / asset pricing
    - Other operations for DeFi platforms deployed to Caspernet

### Quickstart

Install the package with:

```
npm install fl-casper-tools
```

and import into your project with the following code:

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

### Usage

CasperBlockchain is a very light wrapper for the casper-sdk, which will only contain methods necessary for the data aggregation processes.

Create an instance by passing your JSON-RPC url to the constructor.  This should point to port 7777/rpc on your node server.

```javascript
const blockchain = new CasperBlockchain(jsonRpcProviderUrl);
```

Simple example - get the current blockchain height:
```javascript
const height = await blockchain.getCurrentBlockHeight();
```

The use the examples you will need to have a postgres database set up with the blocks table created.

The blocks table can be created with the following SQL code:

```
CREATE TABLE IF NOT EXISTS public.blocks
(
    block_hash character varying(64) NOT NULL,
    parent_hash character varying(64),
    state_root_hash character varying(64),
    body_hash character varying(64),
    random_bit boolean,
    accumulated_seed character varying(64),
    era_end boolean,
    timestamp_utc timestamp with time zone,
    era_id integer,
    block_height integer NOT NULL,
    protocol_version character varying(20),
    proposer character varying(68),
    deploy_hashes character varying(64)[],
    transfer_hashes character varying(64)[],
    api_version character varying(20),
    CONSTRAINT pk_blocks_id PRIMARY KEY (block_height)
)
```

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

### Testing:

If you clone this repository directly, you can run the included unit tests with the npm command:
```
npm run test
```

### Documentation:

Full documentation can be found in the [docs](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/docs/) folder.

* [Requirements](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/docs/REQUIREMENTS.md)
* [Installation](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/docs/INSTALLATION.md)
* [Usage Overview](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/docs/USAGE_OVERVIEW.md)
* [typedocs](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/docs/typedocs/)

The project was initiated with DEVxDAO proposal [#451](https://portal.devxdao.com/app/proposal/451)

Based on [casper.network](https://casper.network/en/network)

### Opensource components:
* [NodeJS](https://nodejs.org)
* [TypeScript](https://www.typescriptlang.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [node-postgres](https://node-postgres.com/)

### Contributing

Please see [Contributing Guidelines](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/CONTRIBUTING.md).

### Code of Conduct

Please see [Code of Conduct](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/CODE_OF_CONDUCT.md).

### License

This project is licensed under [MIT license](https://github.com/fluidefi/fluidefi-caspernet-aggregator-tools/blob/master/LICENSE.md).

### About us:
* [FLUIDEFI.COM](https://fluidefi.com/)
