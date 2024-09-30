import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlanetsService } from '../services/planets.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { PaginatedPlanetResponse } from '../dtos/planets';

@Controller('planets')
@ApiTags('Planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @ApiOkResponse({
    type: PaginatedPlanetResponse,
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
  async getPlanets(@Query() query: QueryDto) {
    const { page, search } = query;
    const { count, prev, next, results } = await this.planetsService.getPlanets(
      page,
      search,
    );

    return {
      count,
      prev,
      next,
      results,
    } as PaginatedPlanetResponse;
  }
}
