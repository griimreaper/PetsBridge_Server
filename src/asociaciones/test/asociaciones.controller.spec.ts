import { Test, TestingModule } from '@nestjs/testing';
import { AsociacionesController } from '../asociaciones.controller';

describe('AsociacionesController', () => {
  let controller: AsociacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsociacionesController],
    }).compile();

    controller = module.get<AsociacionesController>(AsociacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
