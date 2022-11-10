import {Repository, Entity, DataSource} from "typeorm";
import {MockBlockRepository} from "./MockBlockRepository";
import {Loggable} from "../../src/lib/Loggable";
import {IDataStore} from "../../src";
import {ILogger} from "../../src/interfaces/lib/ILogger";
import {IAlerts} from "../../src/interfaces/lib/IAlerts";
import {Block} from "../../src/entities/Block";

export class MockDataStore extends Loggable implements IDataStore {
  protected repositories: any = {
    'Block': new MockBlockRepository()
  }
  
  constructor(
    logger?: ILogger,
    alerts?: IAlerts
  ) {
    super(logger, alerts);
  }
  
  /**
   * Gets repository from the data source
   * @param entity type of repository to return
   */
  getRepository(entity: any): Repository<typeof Entity> | undefined {
    if(typeof(entity) === 'string') {
      return this.repositories[entity];
    }
    
    return this.repositories[entity.name];
  }
  
  /**
   * Initializes datasource
   */
  async initialize(): Promise<void> {
    return
  }
}
