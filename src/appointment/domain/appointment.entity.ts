import { AppointmentStatus } from './appointment-status.enum';
import { AppointmentAlreadyCanceledError } from './errors/appointment-already-canceled.error';
import { CannotCancelPastAppointmentError } from './errors/cannot-cancel-past-appointment.error';
import { InvalidScheduledAtError } from './errors/invalid-scheduled-at.error';
import { PatientIdRequiredError } from './errors/patient-id-required.error';
import { PractitionerIdRequiredError } from './errors/practitioner-id-required.error';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly practitionerId: string,
    public readonly scheduledAt: Date,
    public status: AppointmentStatus = AppointmentStatus.SCHEDULED,
  ) {
    if (!patientId?.trim()) {
      throw new PatientIdRequiredError();
    }

    if (!practitionerId?.trim()) {
      throw new PractitionerIdRequiredError();
    }

    if (!(scheduledAt instanceof Date) || Number.isNaN(scheduledAt.getTime())) {
      throw new InvalidScheduledAtError();
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