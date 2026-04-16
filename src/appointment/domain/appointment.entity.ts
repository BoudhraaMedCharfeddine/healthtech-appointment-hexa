import { AppointmentStatus } from './appointment-status.enum';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly practitionerId: string,
    public readonly scheduledAt: Date,
    public status: AppointmentStatus = AppointmentStatus.SCHEDULED,
  ) {
    if (!patientId?.trim()) {
      throw new Error('patientId is required');
    }

    if (!practitionerId?.trim()) {
      throw new Error('practitionerId is required');
    }

    if (!(scheduledAt instanceof Date) || Number.isNaN(scheduledAt.getTime())) {
      throw new Error('scheduledAt must be a valid date');
    }
  }

  cancel(now: Date = new Date()) {
    if (this.status === AppointmentStatus.CANCELED) {
      throw new Error('Appointment already canceled');
    }

    if (this.scheduledAt.getTime() < now.getTime()) {
      throw new Error('Cannot cancel a past appointment');
    }

    this.status = AppointmentStatus.CANCELED;
  }
}