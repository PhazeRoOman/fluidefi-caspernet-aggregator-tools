### Installation

######  The following installation instructions were tested on Ubuntu 20.04.2 LTS running on x64 architecture, while using a cloud database provider.  The same dependencies can be installed on any machine / OS and then every step after creating the blocks table should be the same on different machines.

##### Dependencies used in our production environment:

* Ubuntu 22.04
* Node v16.8.0 (tests work on v12.x, 14.x, 16.x)
* PostgreSQL v12 (AWS RDS)

##### Setup Environment

Install node and npm:

```bash
  $ sudo apt install nodejs npm
```

Install postgres, using the documentation found on the [web](https://www.postgresql.org/download/).  The install commands for Ubuntu from that page are:

```bash
# Create the file repository configuration:
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key:
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update the package lists:
sudo apt-get update

# Install the latest version of PostgreSQL.
# If you want a specific version, use 'postgresql-12' or similar instead of 'postgresql':
sudo apt-get -y install postgresql
```

Start an interactive shell to interact with the database engine:
```bash
sudo -u postgres psql
```


Check connection info with:
```bash
\conninfo
```

You should see that you are connected to database “postgres” as user “postgres”.

Since the default “postgres” user does not have a password, you should set it yourself.
```bash
\password postgres
```

Create a new database for the Casper Network data:
```bash
CREATE DATABASE casper_data;
```

Create the `blocks` table in the new database, which will be used by the library as a data store:
```bash
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

You may want to create new users and grant privileges. Please refer to PostgreSQL docs for:
- [creating a user](https://www.postgresql.org/docs/12/app-createuser.html)
- [granting privileges](https://www.postgresql.org/docs/12/ddl-priv.html)

Alternatively (suggested), use a cloud database provider such as:

* [aws](https://aws.amazon.com/rds/postgresql/)
* [heroku](https://www.heroku.com/postgres)
* [digital ocean](https://www.digitalocean.com/products/managed-databases-postgresql)


#### Install Packages

At this point you are ready to install and use the fl-casper-tools package in your local javascript or typescript project.

If you haven't already, initialize npm in your project's base directory:

```bash
  $ npm init -y
```

Install the package:

```bash
  $ npm install fl-casper-tools
```

You are now ready to import classes, types and interfaces from the library:

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
