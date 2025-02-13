import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { EntityAlreadyExistsError } from 'src/errors/entityAlreadyExists.error';

@Catch(EntityAlreadyExistsError)
export class EntityAlreadyExistsFilter implements ExceptionFilter {
  catch(exception: EntityAlreadyExistsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      name: exception.name,
      message: exception.message,
    });
  }
}
