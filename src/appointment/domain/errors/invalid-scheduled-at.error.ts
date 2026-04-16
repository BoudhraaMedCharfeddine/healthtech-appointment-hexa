import { DomainError } from './domain.error';

export class InvalidScheduledAtError extends DomainError {
  constructor() {
    super('scheduledAt must be a valid date');
  }
}