import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: 3 })
  next: number | null;

  @ApiProperty({ example: 1 })
  prev: number | null;

  @ApiProperty({
    isArray: true,
    type: Object,
  })
  results: T[];
}
