import { Test, TestingModule } from '@nestjs/testing';
import { CommentriesController } from './commentries.controller';

describe('CommentriesController', () => {
  let controller: CommentriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentriesController],
    }).compile();

    controller = module.get<CommentriesController>(CommentriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
