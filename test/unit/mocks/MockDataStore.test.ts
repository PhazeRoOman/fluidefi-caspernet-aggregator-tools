import {IDataStore} from '../../../src';
import {MockDataStore} from "../../mocks/MockDataStore";
import {expect} from "chai";
import {IRepository} from "../../../src/interfaces/datastore/IRepository";
import {Block} from "../../../src/entities/Block";
import {Entity} from "typeorm";

describe('MockDataStore', async () => {
  let datastore: IDataStore;
  
  before(async () => {
    datastore = new MockDataStore();
  });
  
  describe('#initialize', async () => {
    it('should initialize', async () => {
      try {
        await datastore.initialize();
        expect(true).to.eql(true);
      } catch(e: any) {
        expect(true).to.eql(false);
      }
    });
  });
  
  describe('#getRepository', async () => {
    it('should get Blocks repository', async () => {
      const blocksRepository: IRepository | undefined = datastore.getRepository(Block);
      expect(!!blocksRepository).to.eql(true);
    });
  
    it('should get Blocks repository by string name', async () => {
      const blocksRepository: IRepository | undefined = datastore.getRepository('Block');
      expect(!!blocksRepository).to.eql(true);
    });
  
    it('should not get unknown repository', async () => {
      const repository: IRepository | undefined = datastore.getRepository(Entity);
      expect(!!repository).to.eql(false);
    });
  
    it('should not get unknown repository by string name', async () => {
      const repository: IRepository | undefined = datastore.getRepository('Entity');
      expect(!!repository).to.eql(false);
    });
  });
});
