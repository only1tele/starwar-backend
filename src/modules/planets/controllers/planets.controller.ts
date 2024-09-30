import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlanetsService } from '../services/planets.service';
import { QueryDto } from 'src/common/dtos/query.dto';
import { PaginatedPlanetResponse, Planet } from '../dtos/planets';
import { ParamIdDto } from 'src/common/dtos/param.dto';
import { CommonApiResponses } from 'src/common/decorators/api-responses.decorator';

@Controller('planets')
@ApiTags('Planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @ApiOkResponse({
    type: PaginatedPlanetResponse,
    description: 'List of planets successfully retrieved',
  })
  @CommonApiResponses()
  @ApiQuery({
    name: 'page',
    description: 'Page number for paginated results, defaults to 1.',
    required: true,
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

  @Get('/:id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the planet.',
    required: false,
    type: 'string',
  })
  @ApiOkResponse({
    type: Planet,
    description: 'Planets details successfully retrieved',
  })
  @CommonApiResponses()
  async getPlanetById(@Param() params: ParamIdDto) {
    return await this.planetsService.getPlanetById(params);
  }
}
