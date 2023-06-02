import { Test, TestingModule } from '@nestjs/testing';
import { AsPublicationsService } from './as_publications.service';

describe('AsPublicationsService', () => {
  let service: AsPublicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsPublicationsService],
    }).compile();

    service = module.get<AsPublicationsService>(AsPublicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
