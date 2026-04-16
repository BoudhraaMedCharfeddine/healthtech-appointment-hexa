import { DomainError } from './domain.error';

export class CannotCancelPastAppointmentError extends DomainError {
  constructor(appointmentId: string) {
    super(`Appointment "${appointmentId}" cannot be canceled because it is in the past`);
  }
}