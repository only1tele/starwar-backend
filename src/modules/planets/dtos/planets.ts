import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginatedResponse } from 'src/common/dtos/paginated-response.dto';

export class PlanetBase {
  @ApiProperty({
    example: '1',
  })
  id: string;

  @ApiProperty({
    example: 'Coruscant',
  })
  name: string;

  @ApiProperty({
    example: '24',
  })
  rotation_period: string;

  @ApiProperty({
    example: '368',
  })
  orbital_period: string;

  @ApiProperty({
    example: '12240',
  })
  diameter: string;

  @ApiProperty({
    example: 'temperate',
  })
  climate: string;

  @ApiProperty({
    example: '1 standard',
  })
  gravity: string;

  @ApiProperty({
    example: 'cityscape, mountains',
  })
  terrain: string;

  @ApiProperty({
    example: 'unknown',
  })
  surface_water: string;

  @ApiProperty({
    example: '1000000000000',
  })
  population: string;
}

export class Planet extends PlanetBase {
  @ApiProperty({
    isArray: true,
    type: String,
    example: ['Luke Skywalker', 'C-3PO'],
  })
  residents: string[];

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['A New Hope', 'Return of the Jedi'],
  })
  films: string[];
}

export class PaginatedPlanetResponse extends PaginatedResponse<PlanetBase> {
  @ApiProperty({
    isArray: true,
    type: PlanetBase,
  })
  results: PlanetBase[];
}
