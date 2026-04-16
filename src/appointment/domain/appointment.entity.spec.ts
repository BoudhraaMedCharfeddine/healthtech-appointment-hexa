import { Appointment } from './appointment.entity';
import { AppointmentStatus } from './appointment-status.enum';
import { AppointmentAlreadyCanceledError } from './errors/appointment-already-canceled.error';
import { CannotCancelPastAppointmentError } from './errors/cannot-cancel-past-appointment.error';
import { InvalidScheduledAtError } from './errors/invalid-scheduled-at.error';
import { PatientIdRequiredError } from './errors/patient-id-required.error';
import { PractitionerIdRequiredError } from './errors/practitioner-id-required.error';

describe('Appointment', () => {
  it('should create an appointment with SCHEDULED status by default', () => {
    const appointment = new Appointment(
      'appointment-1',
      'patient-1',
      'doctor-1',
      new Date('2026-04-20T09:00:00.000Z'),
    );

    expect(appointment.id).toBe('appointment-1');
    expect(appointment.patientId).toBe('patient-1');
    expect(appointment.practitionerId).toBe('doctor-1');
    expect(appointment.status).toBe(AppointmentStatus.SCHEDULED);
  });

  it('should throw when patientId is empty', () => {
    expect(() => {
      new Appointment(
        'appointment-1',
        '',
        'doctor-1',
        new Date('2026-04-20T09:00:00.000Z'),
      );
    }).toThrow(PatientIdRequiredError);
  });

  it('should throw when practitionerId is empty', () => {
    expect(() => {
      new Appointment(
        'appointment-1',
        'patient-1',
        '',
        new Date('2026-04-20T09:00:00.000Z'),
      );
    }).toThrow(PractitionerIdRequiredError);
  });

  it('should throw when scheduledAt is invalid', () => {
    expect(() => {
      new Appointment(
        'appointment-1',
        'patient-1',
        'doctor-1',
        new Date('invalid-date'),
      );
    }).toThrow(InvalidScheduledAtError);
  });

  it('should cancel a future appointment', () => {
    const appointment = new Appointment(
      'appointment-1',
      'patient-1',
      'doctor-1',
      new Date('2026-04-20T09:00:00.000Z'),
    );

    appointment.cancel(new Date('2026-04-19T09:00:00.000Z'));

    expect(appointment.status).toBe(AppointmentStatus.CANCELED);
  });

  it('should throw when canceling an already canceled appointment', () => {
    const appointment = new Appointment(
      'appointment-1',
      'patient-1',
      'doctor-1',
      new Date('2026-04-20T09:00:00.000Z'),
      AppointmentStatus.CANCELED,
    );

    expect(() => {
      appointment.cancel(new Date('2026-04-19T09:00:00.000Z'));
    }).toThrow(AppointmentAlreadyCanceledError);
  });

  it('should throw when canceling a past appointment', () => {
    const appointment = new Appointment(
      'appointment-1',
      'patient-1',
      'doctor-1',
      new Date('2026-04-18T09:00:00.000Z'),
    );

    expect(() => {
      appointment.cancel(new Date('2026-04-19T09:00:00.000Z'));
    }).toThrow(CannotCancelPastAppointmentError);
  });
});