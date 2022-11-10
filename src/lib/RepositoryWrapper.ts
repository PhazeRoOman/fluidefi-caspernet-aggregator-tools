import {IRepository} from "../interfaces/datastore/IRepository";
import {Entity, Repository} from "typeorm";

/**
 * Wrapper class for typeorm Repository
 */
export class RepositoryWrapper implements IRepository {
  repository: Repository<any>;
  
  constructor(repository: Repository<any>) {
    this.repository = repository;
  }
  
  /**
   * Creates a new Entity for the given fields
   * @param fields key-value pairs that must match the schema of the Entity to which the repository belongs
   */
  create(fields: any): any | undefined {
    return this.repository.create(fields);
  }
  
  /**
   * Saves an Entity to the data store
   * @param entity Entity object
   */
  async save(entity: any): Promise<void> {
    await this.repository.save(entity);
  }
}
