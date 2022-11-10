import 'reflect-metadata';
import {DataSource, DataSourceOptions} from 'typeorm';

export function getDataSource(options: DataSourceOptions): DataSource {
  return new DataSource(options);
}
