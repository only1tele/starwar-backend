import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PeopleService } from '../services/people.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { PaginatedPeopleResponse, People } from '../dtos/people';
import { ParamIdDto } from 'src/common/dtos/param.dto';

@Controller('people')
@ApiTags('People')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}
  @ApiOkResponse({
    type: PaginatedPeopleResponse,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for paginated results, defaults to 1.',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'search',
    description: 'Search term to filter results. Optional.',
    required: false,
    type: 'string',
  })
  @Get('/')
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

  @Get('/:id')
  @ApiOkResponse({
    type: People,
  })
  @ApiParam({
    name: 'id',
    description: 'The person ID.',
    required: true,
    type: 'string',
  })
  async getPeopleById(@Param() params: ParamIdDto) {
    return await this.peopleService.getPersonById(params);
  }
}
