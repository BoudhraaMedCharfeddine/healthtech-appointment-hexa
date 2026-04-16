import { DomainError } from './domain.error';

export class PractitionerIdRequiredError extends DomainError {
  constructor() {
    super('practitionerId is required');
  }
}