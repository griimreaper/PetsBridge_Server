import { Test, TestingModule } from '@nestjs/testing';
import { AsociacionesService } from '../asociaciones.service';

describe('AsociacionesService', () => {
  let service: AsociacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsociacionesService],
    }).compile();

    service = module.get<AsociacionesService>(AsociacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
