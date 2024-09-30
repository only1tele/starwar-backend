import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from './people.controller';
import { PeopleService } from '../services/people.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { PaginatedPeopleResponse, People } from '../dtos/people';

describe('PeopleController', () => {
  let controller: PeopleController;
  let peopleService: PeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        {
          provide: PeopleService,
          useValue: {
            getPeople: jest.fn(),
            getPersonById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    peopleService = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPeople', () => {
    it('should call PeopleService.getPeople with correct parameters', async () => {
      const query: QueryDto = { page: 1, search: 'Luke' };
      const mockResponse: PaginatedPeopleResponse = {
        count: 2,
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
            created: '2014-12-09T13:50:51.644000Z',
          },
        ],
      };

      jest
        .spyOn(peopleService, 'getPeople')
        .mockResolvedValueOnce(mockResponse);

      const result = await controller.getPeople(query);

      expect(peopleService.getPeople).toHaveBeenCalledWith(
        query.page,
        query.search,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPeopleById', () => {
    it('should return a person by ID', async () => {
      const personId = { id: '1' };
      const mockPerson: People = {
        id: '1',
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'Tatooine',
        films: ['A New Hope'],
        vehicles: ['Snowspeeder'],
        starships: ['X-wing'],
        created: '2014-12-09T13:50:51.644000Z',
      };

      jest
        .spyOn(peopleService, 'getPersonById')
        .mockResolvedValueOnce(mockPerson);

      const result = await controller.getPeopleById(personId);

      expect(peopleService.getPersonById).toHaveBeenCalledWith(personId);
      expect(result).toEqual(mockPerson);
    });
  });
});
