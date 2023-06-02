import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsUsersController } from '../publications_users.controller';

describe('PublicationsUsersController', () => {
  let controller: PublicationsUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationsUsersController],
    }).compile();

    controller = module.get<PublicationsUsersController>(
      PublicationsUsersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
