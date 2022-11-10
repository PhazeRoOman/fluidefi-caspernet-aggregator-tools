import { IBlockParser } from '../../src';
import { BlockParserResult } from '../../src';

export class MockBlockParser implements IBlockParser {
  private parsedBlocks!: any[];
  private id: number;

  constructor() {
    this.id = Math.floor(Math.random() * 1000000);
    this.parsedBlocks = [];
  }

  injectParsedBlocks(blocks: any[]): void {
    this.parsedBlocks = blocks || [];
  }

  findParsedFieldsByHeight(height: number): any | undefined {
    for (const block of this.parsedBlocks) {
      if (block.blockNumber === height) {
        return block;
      }
    }
  
    return undefined;
  }

  apply(block: any): BlockParserResult {
    if(!!block && !!block.block && !!block.block.header && !!block.block.header.height) {
      const height = block.block.header.height;
      const parsedFields = this.findParsedFieldsByHeight(height);

      return {
        success: !!parsedFields,
        height,
        fields: parsedFields
      };
    }

    return { success: false }
  }
}
