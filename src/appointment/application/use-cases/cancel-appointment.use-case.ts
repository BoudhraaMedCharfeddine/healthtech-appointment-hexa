import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('Appointment not found');
    }

    appointment.cancel();

    await this.appointmentRepository.save(appointment);

    return {
      id: appointment.id,
      status: appointment.status,
    };
  }
}