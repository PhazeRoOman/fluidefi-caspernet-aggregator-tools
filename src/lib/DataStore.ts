import {Loggable} from "./Loggable";
import {IDataStore} from "../interfaces";
import {DataSource, Entity} from "typeorm";
import {ILogger} from "../interfaces/lib/ILogger";
import {IAlerts} from "../interfaces/lib/IAlerts";
import {IRepository} from "../interfaces/datastore/IRepository";
import {RepositoryWrapper} from "./RepositoryWrapper";

export class DataStore extends Loggable implements IDataStore {
  datasource?: DataSource;
  
  /**
   * @param {DataSource} datasource typeorm DataSource
   * @param {ILogger} logger property used for delegation of routing logs
   * @param {IAlerts} alerts property used for delegation of sending alerts
   */
  constructor(
    datasource?: DataSource,
    logger?: ILogger,
    alerts?: IAlerts
  ) {
    super(logger, alerts);
    this.datasource = datasource;
  }
  /**
   * Gets repository from the data source
   * @param entity type of repository to return
   */
  getRepository(entity: typeof Entity): IRepository | undefined {
    return this.datasource
      ? new RepositoryWrapper(this.datasource.getRepository(entity))
      : undefined;
  }
  
  /**
   * Initializes datasource
   */
  async initialize(): Promise<void> {
    if(this.datasource && !this.datasource.isInitialized) {
      await this.datasource.initialize();
    }
  }
}
