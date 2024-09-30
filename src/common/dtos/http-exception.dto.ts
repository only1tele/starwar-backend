import { ApiProperty } from '@nestjs/swagger';

export class HttpNotFoundExceptionDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    example: 'An unexpected error occurred. Please reach out to support.',
  })
  message: string;

  @ApiProperty({ example: '/api/people' })
  path: string;

  @ApiProperty({ example: '2024-09-30T14:09:26.498Z' })
  timestamp: string;
}

export class HttpManyRequestExceptionDto {
  @ApiProperty({ example: 429 })
  statusCode: number;

  @ApiProperty({
    example: 'An unexpected error occurred. Please reach out to support.',
  })
  message: string;

  @ApiProperty({ example: '/api/people' })
  path: string;

  @ApiProperty({ example: '2024-09-30T14:09:26.498Z' })
  timestamp: string;
}

export class HttpServerErrorExceptionDto {
  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({
    example: 'An unexpected error occurred. Please reach out to support.',
  })
  message: string;

  @ApiProperty({ example: '/api/people' })
  path: string;

  @ApiProperty({ example: '2024-09-30T14:09:26.498Z' })
  timestamp: string;
}
