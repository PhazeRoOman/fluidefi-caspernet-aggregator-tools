import {Loggable} from "../../lib/Loggable";
import {IBlockSaver} from "../../interfaces/datastore/IBlockSaver";
import {CasperBlockFields, SaveBlockResult} from "../../types";
import {ILogger} from "../../interfaces/lib/ILogger";
import {IAlerts} from "../../interfaces/lib/IAlerts";
import {Block} from "../../entities/Block";
import {IDataStore} from "../../interfaces";
import {IRepository} from "../../interfaces/datastore/IRepository";

export class BlockSaver extends Loggable implements IBlockSaver {
  protected datastore!: IDataStore;
  
  /**
   * @param {IDataStore} datastore typeorm DataSource wrapper
   * @param {ILogger} logger property used for delegation of routing logs
   * @param {IAlerts} alerts property used for delegation of sending alerts
   */
  constructor(
    datastore: IDataStore,
    logger?: ILogger,
    alerts?: IAlerts
  ) {
    super(logger, alerts);
    this.datastore = datastore;
  }
  
  /**
   * Saves a new Block to the data store for the given fields.
   * @param fields formatted fields, parsed from raw casper block
   */
  async apply(fields: CasperBlockFields): Promise<SaveBlockResult> {
    // resolve repository
    const repository: IRepository | undefined = this.datastore.getRepository(Block);
  
    if(!repository) {
      const message = 'failed to resolve Block Repository';
      this.error(message);
      return { success: false, message };
    }
    
    try {
      // create block entity for given fields
      const block: Block = repository.create(fields);
      
      // check if block was created successfully
      if(!block) {
        const message = `block undefined for fields: ${fields ? JSON.stringify(fields) : undefined}`;
        this.error(message);
        return { success: false, message }
      }
      
      try {
        // save block to data store
        await repository.save(block);
  
        return {
          success: true,
          height: fields.blockNumber,
        };
      } catch(e: any) {
        // catch errors with uniqueness constraint violations
        if(e.toString().includes('unique')) {
          const warningMessage = `duplicate block for fields: ${fields ? JSON.stringify(fields) : undefined}`;
          this.warn(warningMessage);
    
          return {
            success: true,
            height: fields.blockNumber,
            message: warningMessage
          };
        }
  
        // return with failure for other errors
        const errorMessage = `failed to save block with fields: ${fields ? JSON.stringify(fields) : undefined}`;
        this.error(errorMessage, e);
        return { success: false, error: e, message: errorMessage }
      }
    } catch(e: any) {
      // catch errors thrown while trying to create block
      const message = `failed to create block with fields: ${fields ? JSON.stringify(fields) : undefined}`;
      this.error(message, e);
      return { success: false, error: e, message }
    }
  }
}
