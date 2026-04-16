import { DomainError } from './domain.error';

export class AppointmentAlreadyCanceledError extends DomainError {
  constructor(appointmentId: string) {
    super(`Appointment "${appointmentId}" is already canceled`);
  }
}