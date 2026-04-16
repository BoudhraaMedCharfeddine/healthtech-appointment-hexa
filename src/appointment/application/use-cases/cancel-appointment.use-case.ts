import { AppointmentNotFoundError } from '../errors/appointment-not-found.error';
import { AppointmentRepository } from '../ports/appointment.repository';

export type CancelAppointmentCommand = {
  appointmentId: string;
};

export class CancelAppointmentUseCase {
  constructor(
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