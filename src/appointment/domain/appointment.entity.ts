import { AppointmentAlreadyCanceledError } from './errors/appointment-already-canceled.error';
import { CannotCancelPastAppointmentError } from './errors/cannot-cancel-past-appointment.error';
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
      throw new AppointmentAlreadyCanceledError(this.id);
    }

    if (this.scheduledAt.getTime() < now.getTime()) {
      throw new CannotCancelPastAppointmentError(this.id);
    }

    this.status = AppointmentStatus.CANCELED;
  }
}