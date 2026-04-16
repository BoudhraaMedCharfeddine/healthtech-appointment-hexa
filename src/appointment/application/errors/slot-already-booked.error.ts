import { ApplicationError } from './application.error';

export class SlotAlreadyBookedError extends ApplicationError {
  constructor(practitionerId: string, scheduledAt: Date) {
    super(
      `Practitioner "${practitionerId}" already has an appointment at "${scheduledAt.toISOString()}"`,
    );
  }
}