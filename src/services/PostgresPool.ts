import { IDataStore } from '../interfaces';
import { Pool } from 'pg';
import { settings } from '../config/settings';

import { ReadQueryResult, WriteQueryResult } from '../types';

export class PostgresPool implements IDataStore {
  private readPool!: Pool;
  private writePool!: Pool;

  constructor() {
    this.readPool = new Pool({
      ...settings.readOptions,
      max: parseInt(settings.maxReadPoolConnections, 10),
    });

    this.writePool = new Pool({
      ...settings.writeOptions,
      max: parseInt(settings.maxWritePoolConnections, 10),
    });
  }

  async read(query: string, values: any[]): Promise<ReadQueryResult> {
    return new Promise((resolve, reject) => {
      this.readPool.connect((error: any, client: any, release: any) => {
        if (error) {
          resolve({
            success: false,
            error: `Error acquiring reader client ${error.toString()}`,
          });
        } else {
          client.query(query, values, (err: any, result: any) => {
            release();

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
        }
      });
    });
  }

  async write(query: string, values: any[]): Promise<WriteQueryResult> {
    return new Promise((resolve, reject) => {
      this.writePool.connect((error: any, client: any, release: any) => {
        if (error) {
          resolve({
            success: false,
            error: `Error acquiring writer client ${error.toString()}`,
          });
        } else {
          client.query(query, values, (err: any, result: any) => {
            release();

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
        }
      });
    });
  }
}
