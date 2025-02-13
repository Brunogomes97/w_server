import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundError extends NotFoundException {
  constructor(entityName: string) {
    super(`${entityName} not found!`);
    this.name = 'EntityNotFoundError';
  }
}
