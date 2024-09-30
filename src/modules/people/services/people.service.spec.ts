import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { ConfigService } from '@nestjs/config';
import { PaginatedPeopleResponse } from '../dtos/people';
import {
  StarwarPeople,
  StarwarPeopleResponse,
} from 'src/providers/starwar/starwar.type';

describe('PeopleService', () => {
  let service: PeopleService;
  let starWarService: StarWarService;
  let redisCacheService: RedisCacheService;
  let configService: ConfigService;

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
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(1800), // Mock redisTTL value
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    starWarService = module.get<StarWarService>(StarWarService);
    redisCacheService = module.get<RedisCacheService>(RedisCacheService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPeople', () => {
    it('should return paginated people from cache if available', async () => {
      const mockResponse = {
        count: 10,
        next: 2,
        prev: 1,
        results: [
          {
            id: '1',
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
          },
        ],
      };

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(mockResponse);

      const result = await service.getPeople(1);

      expect(redisCacheService.get).toHaveBeenCalledWith('people_page_1');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch people from StarWarService if not cached', async () => {
      const mockApiResponse = {
        count: 10,
        next: '2',
        previous: '1',
        results: [
          {
            url: 'https://swapi.dev/api/people/1/',
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            created: '2014-12-09T13:50:51.644000Z',
          },
        ],
      } as StarwarPeopleResponse;

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(starWarService, 'getPeople')
        .mockResolvedValue(mockApiResponse);
      jest.spyOn(redisCacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getPeople(1);

      expect(starWarService.getPeople).toHaveBeenCalledWith(1, undefined);
      expect(redisCacheService.set).toHaveBeenCalledWith(
        'people_page_1',
        {
          count: mockApiResponse.count,
          next: null,
          prev: null,
          results: [
            {
              id: '1',
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              hair_color: 'blond',
              skin_color: 'fair',
              eye_color: 'blue',
              birth_year: '19BBY',
              gender: 'male',
              created: '2014-12-09T13:50:51.644000Z',
            },
          ],
        },
        1800,
      );

      expect(result.count).toEqual(mockApiResponse.count);
      expect(result.results[0].name).toBe('Luke Skywalker');
    });
  });

  describe('getPersonById', () => {
    it('should return a person by ID from cache if available', async () => {
      const mockPerson = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'Tatooine',
        films: ['A New Hope', 'The Empire Strikes Back'],
        vehicles: ['Snowspeeder', 'Imperial Speeder Bike'],
        starships: ['X-wing', 'Imperial shuttle'],
      } as StarwarPeople;

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(mockPerson);

      const result = await service.getPersonById({ id: '1' });

      expect(redisCacheService.get).toHaveBeenCalledWith('person_1');
      expect(result).toEqual(mockPerson);
    });

    it('should fetch a person by ID from StarWarService if not cached', async () => {
      const mockApiResponse = {
        url: 'https://swapi.dev/api/people/1/',
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        films: ['https://swapi.dev/api/films/1/'],
        vehicles: ['https://swapi.dev/api/vehicles/14/'],
        starships: ['https://swapi.dev/api/starships/12/'],
        created: '2014-12-09T13:50:51.644000Z',
      } as StarwarPeople;

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(starWarService, 'getPeopleByID')
        .mockResolvedValue(mockApiResponse);
      jest.spyOn(service, 'fetchFilms').mockResolvedValue(['A New Hope']);
      jest.spyOn(service, 'fetchStarships').mockResolvedValue(['X-wing']);
      jest.spyOn(service, 'fetchVehicles').mockResolvedValue(['Snowspeeder']);
      jest.spyOn(service, 'fetchHomeworld').mockResolvedValue('Tatooine');
      jest.spyOn(redisCacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getPersonById({ id: '1' });

      expect(starWarService.getPeopleByID).toHaveBeenCalledWith('1');
      expect(result.name).toBe('Luke Skywalker');
      expect(result.films).toEqual(['A New Hope']);
      expect(result.homeworld).toBe('Tatooine');
      expect(result.vehicles).toEqual(['Snowspeeder']);
      expect(result.starships).toEqual(['X-wing']);
    });
  });
});
