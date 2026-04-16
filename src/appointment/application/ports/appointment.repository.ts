import { Appointment } from '../../domain/appointment.entity';

export const APPOINTMENT_REPOSITORY = Symbol('APPOINTMENT_REPOSITORY');

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
  existsByPractitionerIdAndScheduledAt(
    practitionerId: string,
    scheduledAt: Date,
  ): Promise<boolean>;
}