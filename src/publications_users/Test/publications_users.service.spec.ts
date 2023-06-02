import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsUsersService } from '../publications_users.service';

describe('PublicationsUsersService', () => {
  let service: PublicationsUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicationsUsersService],
    }).compile();

    service = module.get<PublicationsUsersService>(PublicationsUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
