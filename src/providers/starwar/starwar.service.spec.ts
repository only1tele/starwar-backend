import { Test, TestingModule } from '@nestjs/testing';
import { StarWarService } from './starwar.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  StarwarPeopleResponse,
  StarwarPeople,
  StarwarPlanetsResponse,
  StarwarPlanet,
} from './starwar.type';

describe('StarWarService', () => {
  let service: StarWarService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://swapi.dev/api'),
          },
        },
      ],
    }).compile();

    service = module.get<StarWarService>(StarWarService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPeople', () => {
    it('should call the correct endpoint and return people data', async () => {
      const mockResponse: AxiosResponse<StarwarPeopleResponse> = {
        data: {
          count: 82,
          next: 'https://swapi.dev/api/people/?page=2',
          previous: null,
          results: [
            {
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              hair_color: 'blond',
              skin_color: 'fair',
              eye_color: 'blue',
              birth_year: '19BBY',
              gender: 'male',
              homeworld: 'https://swapi.dev/api/planets/1/',
              films: [],
              species: [],
              vehicles: [],
              starships: [],
              created: '2014-12-09T13:50:51.644000Z',
              edited: '2014-12-20T21:17:56.891000Z',
              url: 'https://swapi.dev/api/people/1/',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getPeople(1, '');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://swapi.dev/api/people',
        {
          params: { page: 1, search: '' },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getPeopleByID', () => {
    it('should call the correct endpoint and return a single person', async () => {
      const mockResponse: AxiosResponse<StarwarPeople> = {
        data: {
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'blue',
          birth_year: '19BBY',
          gender: 'male',
          homeworld: 'https://swapi.dev/api/planets/1/',
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: '2014-12-09T13:50:51.644000Z',
          edited: '2014-12-20T21:17:56.891000Z',
          url: 'https://swapi.dev/api/people/1/',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getPeopleByID('1');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://swapi.dev/api/people/1',
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getPlanets', () => {
    it('should call the correct endpoint and return planets data', async () => {
      const mockResponse: AxiosResponse<StarwarPlanetsResponse> = {
        data: {
          count: 60,
          next: 'https://swapi.dev/api/planets/?page=2',
          previous: null,
          results: [
            {
              name: 'Tatooine',
              rotation_period: '23',
              orbital_period: '304',
              diameter: '10465',
              climate: 'arid',
              gravity: '1 standard',
              terrain: 'desert',
              surface_water: '1',
              population: '200000',
              residents: [],
              films: [],
              created: '2014-12-09T13:50:49.641000Z',
              edited: '2014-12-20T20:58:18.411000Z',
              url: 'https://swapi.dev/api/planets/1/',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getPlanets(1, '');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://swapi.dev/api/planets',
        {
          params: { page: 1, search: '' },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getPlanetByID', () => {
    it('should call the correct endpoint and return a single planet', async () => {
      const mockResponse: AxiosResponse<StarwarPlanet> = {
        data: {
          name: 'Tatooine',
          rotation_period: '23',
          orbital_period: '304',
          diameter: '10465',
          climate: 'arid',
          gravity: '1 standard',
          terrain: 'desert',
          surface_water: '1',
          population: '200000',
          residents: [],
          films: [],
          created: '2014-12-09T13:50:49.641000Z',
          edited: '2014-12-20T20:58:18.411000Z',
          url: 'https://swapi.dev/api/planets/1/',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getPlanetByID('1');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://swapi.dev/api/planets/1',
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getByUrl', () => {
    it('should call the correct URL and return data', async () => {
      const mockResponse: AxiosResponse<any> = {
        data: { name: 'Luke Skywalker' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getByUrl('https://swapi.dev/api/people/1/');

      expect(httpService.get).toHaveBeenCalledWith(
        'https://swapi.dev/api/people/1/',
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
