import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from './planets.service';
import { StarWarService } from 'src/providers/starwar/starwar.service';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import {
  StarwarPlanet,
  StarwarPlanetsResponse,
} from 'src/providers/starwar/starwar.type';
import { PaginatedPlanetResponse } from '../dtos/planets';

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
            getPlanets: jest.fn(),
            getPlanetByID: jest.fn(),
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

  describe('getPlanets', () => {
    it('should return cached planets if available', async () => {
      const mockResponse = {
        count: 60,
        next: 2,
        prev: 1,
        results: [
          {
            id: '1',
            name: 'Coruscant',
            rotation_period: '24',
            orbital_period: '368',
            diameter: '12240',
            climate: 'temperate',
            gravity: '1 standard',
            terrain: 'cityscape, mountains',
            surface_water: 'unknown',
            population: '1000000000000',
          },
        ],
      } as PaginatedPlanetResponse;

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(mockResponse);

      const result = await service.getPlanets(1, '');

      expect(redisCacheService.get).toHaveBeenCalledWith('planets_page_1');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch planets from StarWarService and cache them if not cached', async () => {
      const mockApiResponse = {
        count: 60,
        next: '2',
        previous: '1',
        results: [
          {
            url: 'https://swapi.dev/api/planets/1/',
            name: 'Coruscant',
            rotation_period: '24',
            orbital_period: '368',
            diameter: '12240',
            climate: 'temperate',
            gravity: '1 standard',
            terrain: 'cityscape, mountains',
            surface_water: 'unknown',
            population: '1000000000000',
            residents: ['https://swapi.dev/api/people/1/'],
            films: ['https://swapi.dev/api/films/1/'],
            created: '2014-12-10T11:54:13.386000Z',
          },
        ],
      } as StarwarPlanetsResponse;

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(starWarService, 'getPlanets')
        .mockResolvedValue(mockApiResponse);
      jest.spyOn(redisCacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getPlanets(1, '');

      expect(starWarService.getPlanets).toHaveBeenCalledWith(1, '');
      expect(redisCacheService.set).toHaveBeenCalledWith(
        'planets_page_1',
        {
          count: mockApiResponse.count,
          next: null,
          prev: null,
          results: [
            {
              id: '1',
              name: 'Coruscant',
              rotation_period: '24',
              orbital_period: '368',
              diameter: '12240',
              climate: 'temperate',
              gravity: '1 standard',
              terrain: 'cityscape, mountains',
              surface_water: 'unknown',
              population: '1000000000000',
            },
          ],
        },
        300,
      );

      expect(result.count).toEqual(mockApiResponse.count);
      expect(result.results[0].name).toBe('Coruscant');
    });
  });

  describe('getPlanetById', () => {
    it('should return a planet by ID from cache if available', async () => {
      const mockPlanet = {
        name: 'Coruscant',
        rotation_period: '24',
        orbital_period: '368',
        diameter: '12240',
        climate: 'temperate',
        gravity: '1 standard',
        terrain: 'cityscape, mountains',
        surface_water: 'unknown',
        population: '1000000000000',
        residents: ['Luke Skywalker'],
        films: ['A New Hope'],
      } as StarwarPlanet;

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(mockPlanet);

      const result = await service.getPlanetById({ id: '1' });

      expect(redisCacheService.get).toHaveBeenCalledWith('planet_1');
      expect(result).toEqual(mockPlanet);
    });

    it('should fetch a planet by ID from StarWarService and cache it if not cached', async () => {
      const mockApiResponse = {
        url: 'https://swapi.dev/api/planets/1/',
        name: 'Coruscant',
        rotation_period: '24',
        orbital_period: '368',
        diameter: '12240',
        climate: 'temperate',
        gravity: '1 standard',
        terrain: 'cityscape, mountains',
        surface_water: 'unknown',
        population: '1000000000000',
        residents: ['https://swapi.dev/api/people/1/'],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T11:54:13.386000Z',
      } as StarwarPlanet;

      jest.spyOn(redisCacheService, 'get').mockResolvedValue(null);
      jest
        .spyOn(starWarService, 'getPlanetByID')
        .mockResolvedValue(mockApiResponse);
      jest
        .spyOn(service, 'fetchResidents')
        .mockResolvedValue(['Luke Skywalker']);
      jest.spyOn(service, 'fetchFilms').mockResolvedValue(['A New Hope']);
      jest.spyOn(redisCacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getPlanetById({ id: '1' });

      expect(starWarService.getPlanetByID).toHaveBeenCalledWith('1');
      expect(result.name).toBe('Coruscant');
      expect(result.residents).toEqual(['Luke Skywalker']);
      expect(result.films).toEqual(['A New Hope']);
    });
  });
});
