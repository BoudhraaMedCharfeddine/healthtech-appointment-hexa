import { randomUUID } from 'crypto';
import { Appointment } from '../../domain/appointment.entity';
import { PastAppointmentBookingError } from '../errors/past-appointment-booking.error';
import { SlotAlreadyBookedError } from '../errors/slot-already-booked.error';
import { AppointmentRepository } from '../ports/appointment.repository';

export type BookAppointmentCommand = {
  patientId: string;
  practitionerId: string;
  scheduledAt: Date;
};

export class BookAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(command: BookAppointmentCommand) {
    if (command.scheduledAt.getTime() < Date.now()) {
      throw new PastAppointmentBookingError(command.scheduledAt);
    }

    const slotAlreadyTaken =
      await this.appointmentRepository.existsByPractitionerIdAndScheduledAt(
        command.practitionerId,
        command.scheduledAt,
      );

    if (slotAlreadyTaken) {
      throw new SlotAlreadyBookedError(
        command.practitionerId,
        command.scheduledAt,
      );
    }

    const appointment = new Appointment(
      randomUUID(),
      command.patientId,
      command.practitionerId,
      command.scheduledAt,
    );

    await this.appointmentRepository.save(appointment);

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      practitionerId: appointment.practitionerId,
      scheduledAt: appointment.scheduledAt,
      status: appointment.status,
    };
  }
}