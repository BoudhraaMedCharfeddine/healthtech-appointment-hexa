import { ApplicationError } from './application.error';

export class AppointmentNotFoundError extends ApplicationError {
  constructor(appointmentId: string) {
    super(`Appointment with id "${appointmentId}" was not found`);
  }
}