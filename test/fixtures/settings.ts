import * as dotenv from 'dotenv';
dotenv.config();

export const settings = {
  readOptions: {
    host: process.env.READ_DB_CONNECTION_HOST,
    database: process.env.READ_DB_CONNECTION_DATABASE,
    user: process.env.READ_DB_CONNECTION_USERNAME,
    password: process.env.READ_DB_CONNECTION_PASSWORD,
    port: process.env.READ_DB_CONNECTION_PORT ? parseInt(process.env.READ_DB_CONNECTION_PORT, 10) : 5432,
    ssl: { rejectUnauthorized: false },
  },
  writeOptions: {
    host: process.env.WRITE_DB_CONNECTION_HOST,
    database: process.env.WRITE_DB_CONNECTION_DATABASE,
    user: process.env.WRITE_DB_CONNECTION_USERNAME,
    password: process.env.WRITE_DB_CONNECTION_PASSWORD,
    port: process.env.WRITE_DB_CONNECTION_PORT ? parseInt(process.env.WRITE_DB_CONNECTION_PORT, 10) : 5432,
    ssl: { rejectUnauthorized: false },
  },
  maxReadPoolConnections: process.env.MAX_READ_POOL_CONNECTIONS || '10',
  maxWritePoolConnections: process.env.MAX_WRITE_POOL_CONNECTIONS || '30',
  blockchain: {
    providerUrl: process.env.CASPERNET_PROVIDER_URL,
    blockchainConfirmations: process.env.CASPERNET_BLOCKCHAIN_CONFIRMATIONS || '5',
  },
};
