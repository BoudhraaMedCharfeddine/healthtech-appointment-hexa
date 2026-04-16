import { Appointment } from '../../domain/appointment.entity';
import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { CannotCancelPastAppointmentError } from '../../domain/errors/cannot-cancel-past-appointment.error';
import { AppointmentRepository } from '../ports/appointment.repository';
import { AppointmentNotFoundError } from '../errors/appointment-not-found.error';
import { CancelAppointmentUseCase } from './cancel-appointment.use-case';

describe('CancelAppointmentUseCase', () => {
  let appointmentRepository: jest.Mocked<AppointmentRepository>;
  let useCase: CancelAppointmentUseCase;

  beforeEach(() => {
    appointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      existsByPractitionerIdAndScheduledAt: jest.fn(),
    };

    useCase = new CancelAppointmentUseCase(appointmentRepository);
  });

  it('should cancel an existing future appointment', async () => {
    const appointment = new Appointment(
      'appointment-1',
      'patient-1',
      'doctor-1',
      new Date(Date.now() + 1000 * 60 * 60),
      AppointmentStatus.SCHEDULED,
    );

    appointmentRepository.findById.mockResolvedValue(appointment);
    appointmentRepository.save.mockResolvedValue();

    const result = await useCase.execute({
      appointmentId: 'appointment-1',
    });

    expect(result).toEqual({
      id: 'appointment-1',
      status: AppointmentStatus.CANCELED,
    });

    expect(appointmentRepository.findById).toHaveBeenCalledWith('appointment-1');
    expect(appointmentRepository.save).toHaveBeenCalledWith(appointment);
  });

  it('should throw when appointment does not exist', async () => {
    appointmentRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        appointmentId: 'appointment-1',
      }),
    ).rejects.toThrow(AppointmentNotFoundError);

    expect(appointmentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw when canceling a past appointment', async () => {
    const appointment = new Appointment(
      'appointment-1',
      'patient-1',
      'doctor-1',
      new Date(Date.now() - 1000 * 60 * 60),
      AppointmentStatus.SCHEDULED,
    );

    appointmentRepository.findById.mockResolvedValue(appointment);

    await expect(
      useCase.execute({
        appointmentId: 'appointment-1',
      }),
    ).rejects.toThrow(CannotCancelPastAppointmentError);

    expect(appointmentRepository.save).not.toHaveBeenCalled();
  });
});