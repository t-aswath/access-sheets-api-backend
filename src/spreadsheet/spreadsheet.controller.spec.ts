import { Test, TestingModule } from '@nestjs/testing';
import { SpreadsheetController } from './spreadsheet.controller';
import { SpreadsheetService } from './spreadsheet.service';

describe('SpreadsheetController', () => {
  let controller: SpreadsheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpreadsheetController],
      providers: [SpreadsheetService],
    }).compile();

    controller = module.get<SpreadsheetController>(SpreadsheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
