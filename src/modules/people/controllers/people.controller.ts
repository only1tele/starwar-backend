import { Controller, Query } from '@nestjs/common';
import { PeopleService } from '../services/people.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { PaginatedPeopleResponse } from '../dtos/people';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  async getPeople(@Query() query: QueryDto) {
    const { page, search } = query;
    const { count, prev, next, results } = await this.peopleService.getPeople(
      page,
      search,
    );

    return {
      count,
      prev,
      next,
      results,
    } as PaginatedPeopleResponse;
  }
}
