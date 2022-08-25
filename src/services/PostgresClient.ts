import { IDataStore } from '../interfaces';
import { Client } from 'pg';
import { PostgresConnectionOptions, ReadQueryResult, WriteQueryResult } from '../types';

/**
 * The IDataStore implementation for using a postgres.  Uses node-pg Client.
 */
export class PostgresClient implements IDataStore {
  protected readClient!: Client;
  protected writeClient!: Client;
  protected readerInitialized: boolean = false;
  protected writerInitialized: boolean = false;

  /**
   * Constructor is passed config options that are the same as those used for pg.Client constructor:
   * [pg.Client](https://node-postgres.com/api/client)
   * @param writeOptions connection options for data store write instance - same as config for pg.Client constructor
   * @param [readOptions] connection options for data store read instance - same as config for pg.Client constructor
   */
  constructor(writeOptions: PostgresConnectionOptions, readOptions: PostgresConnectionOptions | null = null) {
    this.writeClient = new Client(writeOptions);

    if (readOptions) {
      this.readClient = new Client(readOptions);
    } else {
      this.readClient = this.writeClient;
    }
  }

  async closeConnections(): Promise<void> {
    await this.writeClient.end();

    try {
      await this.readClient.end();
    } catch (e) {
      // if reader is writer
    }
  }

  /**
   * Reads data from the postgres data store read instance, if it exists, otherwise the writer instance.
   * @param query read query to execute on the data store
   * @param values array of variables to substitute into the query, if required
   */
  async read(query: string, values: any[]): Promise<ReadQueryResult> {
    if (!this.readerInitialized) {
      let error: any;

      await new Promise((resolve, reject) => {
        this.readClient.connect((err: any) => {
          if (err) {
            error = err;
          } else {
            this.readerInitialized = true;
          }

          resolve(null);
        });
      });

      if (!this.readerInitialized) {
        return {
          success: false,
          error: `Could not connect to read client: ${error ? error.toString : undefined}`,
        };
      }
    }

    return new Promise((resolve, reject) => {
      this.readClient.query(query, values, (err: any, result: any) => {
        if (err) {
          resolve({
            success: false,
            error: `Error making read query: ${err.toString()}`,
          });
        } else if (result && result.hasOwnProperty('rows')) {
          resolve({
            success: true,
            result: result.rows.slice(),
          });
        } else {
          resolve({
            success: false,
            error: 'No rows in result for read query',
          });
        }
      });
    });
  }

  /**
   * Writes data to the postgres data store writer instance.
   * @param query write query to execute on the data store
   * @param values array of variables to substitute into the query, if required
   */
  async write(query: string, values: any[]): Promise<WriteQueryResult> {
    if (!this.writerInitialized) {
      let error: any;

      await new Promise((resolve, reject) => {
        this.writeClient.connect((err: any) => {
          if (err) {
            error = err;
          } else {
            this.writerInitialized = true;
          }

          resolve(null);
        });
      });

      if (!this.writerInitialized) {
        return {
          success: false,
          error: `Could not connect to write client: ${error ? error.toString : undefined}`,
        };
      }
    }

    return new Promise((resolve, reject) => {
      this.writeClient.query(query, values, (err: any, result: any) => {
        if (err) {
          if (err.hasOwnProperty('message') && err.message.includes('unique constraint')) {
            resolve({
              success: true,
              result: [],
            });
          } else if (err.toString().includes('unique constraint')) {
            resolve({
              success: true,
              result: [],
            });
          } else {
            resolve({
              success: false,
              error: `Error making write query: ${err.toString()}`,
            });
          }
        } else if (result && result.hasOwnProperty('rows')) {
          resolve({
            success: true,
            result: result.rows.slice(),
          });
        } else {
          resolve({
            success: false,
            error: 'No rows in result for write query:',
          });
        }
      });
    });
  }
}
