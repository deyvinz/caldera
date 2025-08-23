import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determine message
    let message = 'Internal Server Error';
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        message = (response as any).message || exception.message;
      } else {
        message = exception.message;
      }
    } else if (exception.message) {
      message = exception.message;
    }

    // Log error (redacted for security)
    this.logger.error(
      `Exception occurred: ${message}`,
      {
        status,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        // Don't log sensitive data
        userAgent: request.get('User-Agent'),
        ip: request.ip,
      },
      exception.stack
    );

    // Create error response
    const errorResponse = {
      ok: false,
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Add validation errors if available
    if (exception instanceof HttpException && status === HttpStatus.BAD_REQUEST) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null && (response as any).errors) {
        errorResponse['errors'] = (response as any).errors;
      }
    }

    // Send response
    response.status(status).json(errorResponse);
  }
}
