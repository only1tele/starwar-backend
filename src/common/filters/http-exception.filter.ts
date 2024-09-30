import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';

import { CUSTOM_ERROR_MESSAGES } from 'src/config/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let validationErrors: any = null;

    if (exception instanceof AxiosError) {
      status = exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        exception.response?.statusText ||
        CUSTOM_ERROR_MESSAGES.EXTERNAL_SERVICE_ERROR;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        exceptionResponse &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const responseMessage = exceptionResponse as any;

        if (Array.isArray(responseMessage.message)) {
          validationErrors = responseMessage.message;
        } else {
          message = responseMessage.message || exception.message;
        }
      } else {
        message =
          (exception.getResponse() as any)?.message || exception.getResponse();
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = CUSTOM_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    }

    this.logger.error({
      method: request.method,
      url: request.url,
      status: status,
      message: exception instanceof Error ? exception.message : message,
      validationErrors: validationErrors || null,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        status === HttpStatus.TOO_MANY_REQUESTS
          ? message
          : validationErrors || CUSTOM_ERROR_MESSAGES.UNEXPECTED_ERROR,
    });
  }
}
