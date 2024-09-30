import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from '../services/planets.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { PaginatedPlanetResponse, Planet, PlanetBase } from '../dtos/planets';

describe('PlanetsController', () => {
  let controller: PlanetsController;
  let planetsService: PlanetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetsController],
      providers: [
        {
          provide: PlanetsService,
          useValue: {
            getPlanets: jest.fn(),
            getPlanetById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlanetsController>(PlanetsController);
    planetsService = module.get<PlanetsService>(PlanetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlanets', () => {
    it('should call PlanetsService.getPlanets with correct parameters', async () => {
      const query: QueryDto = { page: 1, search: 'Tatooine' };
      const mockResponse: PaginatedPlanetResponse = {
        count: 1,
        next: null,
        prev: null,
        results: [
          {
            id: '1',
            name: 'Tatooine',
            rotation_period: '23',
            orbital_period: '304',
            diameter: '10465',
            climate: 'arid',
            gravity: '1 standard',
            terrain: 'desert',
            surface_water: '1',
            population: '200000',
          },
        ],
      };

      jest
        .spyOn(planetsService, 'getPlanets')
        .mockResolvedValueOnce(mockResponse);

      const result = await controller.getPlanets(query);

      expect(planetsService.getPlanets).toHaveBeenCalledWith(
        query.page,
        query.search,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPlanetById', () => {
    it('should return a planet by ID', async () => {
      const planetId = { id: '1' };
      const mockPlanet: Planet = {
        id: '1',
        name: 'Tatooine',
        rotation_period: '23',
        orbital_period: '304',
        diameter: '10465',
        climate: 'arid',
        gravity: '1 standard',
        terrain: 'desert',
        surface_water: '1',
        population: '200000',
        residents: ['Luke Skywalker', 'C-3PO'],
        films: ['A New Hope', 'Return of the Jedi'],
      };

      jest
        .spyOn(planetsService, 'getPlanetById')
        .mockResolvedValueOnce(mockPlanet);

      const result = await controller.getPlanetById(planetId);

      expect(planetsService.getPlanetById).toHaveBeenCalledWith(planetId);
      expect(result).toEqual(mockPlanet);
    });
  });
});
