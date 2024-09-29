import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginatedResponse } from 'src/common/dtos/paginated-response.dto';

export class PeopleBase {
  @ApiProperty({
    example: '1',
  })
  id: string;

  @ApiProperty({
    example: 'Luke Skywalker',
  })
  name: string;

  @ApiProperty({
    example: '172',
  })
  height: string;

  @ApiProperty({
    example: '77',
  })
  mass: string;

  @ApiProperty({
    example: 'blond',
  })
  hair_color: string;

  @ApiProperty({
    example: 'fair',
  })
  skin_color: string;

  @ApiProperty({
    example: 'blue',
  })
  eye_color: string;

  @ApiProperty({
    example: '19BBY',
  })
  birth_year: string;

  @ApiProperty({
    example: 'male',
  })
  gender: string;

  @ApiProperty({
    example: '19BBY',
  })
  created: string;
}

export class People extends PeopleBase {
  @ApiProperty({
    example: 'Tatooine',
  })
  homeworld: string;

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['A New Hope', 'The Empire Strikes Back'],
  })
  films: string[];

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['Snowspeeder', 'Imperial Speeder Bike'],
  })
  vehicles: string[];

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['X-wing', 'Imperial shuttle'],
  })
  starships: string[];
}

export class PaginatedPeopleResponse extends PaginatedResponse<PeopleBase> {
  @ApiProperty({
    isArray: true,
    type: PeopleBase,
  })
  results: PeopleBase[];
}
