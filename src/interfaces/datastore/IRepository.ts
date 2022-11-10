export interface IRepository {
  /**
   * Creates a new Entity for the given fields
   * @param fields key-value pairs that must match the schema of the Entity to which the repository belongs
   */
  create(fields: any): any | undefined;
  
  /**
   * Saves an Entity to the data store
   * @param entity Entity object
   */
  save(entity: any): Promise<void>;
}
