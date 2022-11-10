import {IRepository} from "./IRepository";

export interface IDataStore {
  /**
   * Gets repository from the data source
   * @param entity type of repository to return
   */
  getRepository(entity: any): IRepository | undefined;
  
  /**
   * Initializes data source
   */
  initialize(): Promise<void>;
}
