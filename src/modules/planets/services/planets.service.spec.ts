import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from './planets.service';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

describe('PlanetsService', () => {
  let service: PlanetsService;
  let starWarService: StarWarService;
  let redisCacheService: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsService,
        {
          provide: StarWarService,
          useValue: {
            getPlanetByID: jest.fn(),
            getPlanets: jest.fn(),
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

    service = module.get<PlanetsService>(PlanetsService);
    starWarService = module.get<StarWarService>(StarWarService);
    redisCacheService = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
