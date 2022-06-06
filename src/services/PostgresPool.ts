import { IDataStore } from '../interfaces/IDataStore';
import { Pool } from 'pg';
import { settings } from '../config/settings';

import {
  ReadQueryResult,
  WriteQueryResult
} from '../types/services';

export class PostgresPool implements IDataStore {
  private readPool!: Pool;
  private writePool!: Pool;

  constructor() {
    this.readPool = new Pool({
      ...settings.readOptions,
      max: parseInt(settings.maxReadPoolConnections)
    });

    this.writePool = new Pool({
      ...settings.writeOptions,
      max: parseInt(settings.maxWritePoolConnections)
    });
  }

  async read(query: string, values: any[]): Promise<ReadQueryResult> {
    return new Promise((resolve, reject) => {
      this.readPool.connect((err: any, client: any, release: any) => {
        if (err) {
          console.log('Error acquiring reader client');
          console.log(err);
          // TODO - log error

          resolve({
            success: false,
            error: err.toString()
          });
        } else {
          client.query(query, values, (err: any, result: any) => {
            release();

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
          });
        }
      });
    });
  }

  async write(query: string, values: any[]): Promise<WriteQueryResult> {
    return new Promise((resolve, reject) => {
      this.writePool.connect((err: any, client: any, release: any) => {
        if (err) {
          console.log('Error acquiring writer client');
          console.log(err);
          // TODO - log error

          resolve({
            success: false,
            error: err.toString()
          });
        } else {
          client.query(query, values, (err: any, result: any) => {
            release();

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
          });
        }
      });
    });
  }
}