import { ApplicationError } from './application.error';

export class PastAppointmentBookingError extends ApplicationError {
  constructor(scheduledAt: Date) {
    super(`Cannot book an appointment in the past: "${scheduledAt.toISOString()}"`);
  }
}