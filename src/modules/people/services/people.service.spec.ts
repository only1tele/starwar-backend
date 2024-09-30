import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

describe('PeopleService', () => {
  let service: PeopleService;
  let starWarService: StarWarService;
  let redisCacheService: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: StarWarService,
          useValue: {
            getPeopleByID: jest.fn(),
            getPeople: jest.fn(),
            getByUrl: jest.fn(),
          },
        },
        {
          provide: RedisCacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    starWarService = module.get<StarWarService>(StarWarService);
    redisCacheService = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
