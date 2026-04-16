import { Inject, Injectable } from '@nestjs/common';
import { AppointmentNotFoundError } from '../errors/appointment-not-found.error';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentRepository,
} from '../ports/appointment.repository';

type CancelAppointmentCommand = {
  appointmentId: string;
};

@Injectable()
export class CancelAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(command: CancelAppointmentCommand) {
    const appointment = await this.appointmentRepository.findById(
      command.appointmentId,
    );

    if (!appointment) {
      throw new AppointmentNotFoundError(command.appointmentId);
    }

    appointment.cancel();

    await this.appointmentRepository.save(appointment);

    return {
      id: appointment.id,
      status: appointment.status,
    };
  }
}