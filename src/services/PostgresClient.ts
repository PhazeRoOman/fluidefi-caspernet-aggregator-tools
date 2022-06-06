import { IDataStore } from '../interfaces/IDataStore';
import { Client } from 'pg';
import { settings } from '../config/settings';

import {
  ReadQueryResult,
  WriteQueryResult
} from '../types/services';

export class PostgresClient implements IDataStore {
  private readClient!: Client;
  private writeClient!: Client;
  private readerInitialized: boolean = false;
  private writerInitialized: boolean = false;

  constructor() {
    this.readClient = new Client(settings.readOptions);
    this.writeClient = new Client(settings.writeOptions);
  }

  async closeConnections(): Promise<void> {
    await this.readClient.end();
    await this.writeClient.end();
  }

  async read(query: string, values: any[]): Promise<ReadQueryResult> {
    if(!this.readerInitialized) {
      await new Promise((resolve, reject) => {
        this.readClient.connect((err: any) => {
          if (err) {
            // logging...
            console.error('connection error for reader', err.stack);
          } else {
            this.readerInitialized = true;
          }

          resolve(null);
        });
      });
    }

    if(!this.readerInitialized) {
      return {
        success: false,
        error: 'Could not connect to read cluster'
      }
    }

    return new Promise((resolve, reject) => {
      this.readClient.query(query, values, (err: any, result: any) => {
        if(err) {
          console.log('Error making read query: ' + query);
          console.log(err);
          // TODO - log error

          resolve({
            success: false,
            error: err.toString()
          });
        } else if(result && result.hasOwnProperty('rows')) {
          resolve({
            success: true,
            result: result.rows.slice()
          });
        } else {
          console.log("No rows in result for read query: ", query);

          resolve({
            success: false,
            error: 'No rows in query'
          });
        }
      })
    });
  }

  async write(query: string, values: any[]): Promise<WriteQueryResult> {
    if(!this.writerInitialized) {
      await new Promise((resolve, reject) => {
        this.writeClient.connect((err: any) => {
          if (err) {
            // logging...
            console.error('connection error for write cluster', err.stack);
          } else {
            this.writerInitialized = true;
          }

          resolve(null);
        });
      });
    }

    if(!this.writerInitialized) {
      return {
        success: false,
        error: 'Could not connect to write cluster'
      }
    }

    return new Promise((resolve, reject) => {
      this.writeClient.query(query, values, (err: any, result: any) => {
        if(err) {
          if(err.hasOwnProperty('message') && err.message.includes('unique constraint')) {
            resolve({
              success: true,
              result: []
            });
          } else if(err.toString().includes('unique constraint')) {
            resolve({
              success: true,
              result: []
            });
          } else {
            console.log('Error making write query: ' + query);
            console.log(err);
            // TODO - log error

            resolve({
              success: false,
              error: err.toString()
            });
          }
        } else if(result && result.hasOwnProperty('rows')) {
          resolve({
            success: true,
            result: result.rows.slice()
          });
        } else {
          console.log("No rows in result for write query: ");

          // TODO - confirm result from successful writes
          resolve({
            success: false,
            error: 'No rows in query'
          });
        }
      })
    });
  }
}