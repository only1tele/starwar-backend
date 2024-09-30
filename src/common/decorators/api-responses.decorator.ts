import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  HttpManyRequestExceptionDto,
  HttpNotFoundExceptionDto,
  HttpServerErrorExceptionDto,
} from '../dtos/http-exception.dto';

export function CommonApiResponses() {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: 'Resource not found',
      type: HttpNotFoundExceptionDto,
    }),
    ApiResponse({
      status: 429,
      description: 'Too many requests. Please try again later.',
      type: HttpManyRequestExceptionDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      type: HttpServerErrorExceptionDto,
    }),
  );
}
