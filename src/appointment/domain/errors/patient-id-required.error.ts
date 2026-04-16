import { DomainError } from './domain.error';

export class PatientIdRequiredError extends DomainError {
  constructor() {
    super('patientId is required');
  }
}