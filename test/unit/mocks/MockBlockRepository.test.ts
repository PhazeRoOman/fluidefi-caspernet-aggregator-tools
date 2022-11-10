import {BlockSaver} from "../../../src/services/datastore/BlockSaver";
import {IRepository} from "../../../src/interfaces/datastore/IRepository";
import {MockBlockRepository} from "../../mocks/MockBlockRepository";
import {parsedBlocks, invalidParsedBlocks} from '../../fixtures/blocks';
import {Block} from "../../../src/entities/Block";
import {expect} from "chai";

describe('MockBlockRepository', async () => {
  let repository: IRepository;
  
  before(async () => {
    repository = new MockBlockRepository();
  });
  
  describe('#create', async () => {
    parsedBlocks.forEach((block) => {
      it('should create a Block entity from valid fields', async () => {
        const entity: Block = repository.create(block);
        expect(!!entity).to.eql(true);
      });
    });
  
    invalidParsedBlocks.forEach((block) => {
      it('should not create a Block entity from invalid fields', async () => {
        const entity: Block = repository.create(block);
        expect(!!entity).to.eql(false);
      });
    });
  });
  
  describe('#save', async () => {
    parsedBlocks.forEach((block) => {
      it('should save a valid Block entity', async () => {
        try {
          await repository.save(block);
          expect(true).to.eql(true);
        } catch(e) {
          expect(true).to.eql(false);
        }
      });
    });
    
    invalidParsedBlocks.forEach((block) => {
      it('should not save an invalid Block entity', async () => {
        try {
          await repository.save(block);
          expect(true).to.eql(false);
        } catch(e) {
          expect(true).to.eql(true);
        }
      });
    });
  });
});
