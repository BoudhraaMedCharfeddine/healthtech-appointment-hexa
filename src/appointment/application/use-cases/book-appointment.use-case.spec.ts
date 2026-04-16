import { AppointmentRepository } from '../ports/appointment.repository';
import { PastAppointmentBookingError } from '../errors/past-appointment-booking.error';
import { SlotAlreadyBookedError } from '../errors/slot-already-booked.error';
import { BookAppointmentUseCase } from './book-appointment.use-case';

describe('BookAppointmentUseCase', () => {
  let appointmentRepository: jest.Mocked<AppointmentRepository>;
  let useCase: BookAppointmentUseCase;

  beforeEach(() => {
    appointmentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      existsByPractitionerIdAndScheduledAt: jest.fn(),
    };

    useCase = new BookAppointmentUseCase(appointmentRepository);
  });

  it('should book an appointment', async () => {
    appointmentRepository.existsByPractitionerIdAndScheduledAt.mockResolvedValue(false);
    appointmentRepository.save.mockResolvedValue();

    const scheduledAt = new Date(Date.now() + 1000 * 60 * 60);

    const result = await useCase.execute({
      patientId: 'patient-1',
      practitionerId: 'doctor-1',
      scheduledAt,
    });

    expect(result.patientId).toBe('patient-1');
    expect(result.practitionerId).toBe('doctor-1');
    expect(result.scheduledAt).toEqual(scheduledAt);
    expect(result.status).toBe('SCHEDULED');

    expect(
      appointmentRepository.existsByPractitionerIdAndScheduledAt,
    ).toHaveBeenCalledWith('doctor-1', scheduledAt);

    expect(appointmentRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw when booking in the past', async () => {
    const scheduledAt = new Date(Date.now() - 1000 * 60);

    await expect(
      useCase.execute({
        patientId: 'patient-1',
        practitionerId: 'doctor-1',
        scheduledAt,
      }),
    ).rejects.toThrow(PastAppointmentBookingError);

    expect(appointmentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw when the slot is already booked', async () => {
    const scheduledAt = new Date(Date.now() + 1000 * 60 * 60);

    appointmentRepository.existsByPractitionerIdAndScheduledAt.mockResolvedValue(true);

    await expect(
      useCase.execute({
        patientId: 'patient-1',
        practitionerId: 'doctor-1',
        scheduledAt,
      }),
    ).rejects.toThrow(SlotAlreadyBookedError);

    expect(appointmentRepository.save).not.toHaveBeenCalled();
  });
});