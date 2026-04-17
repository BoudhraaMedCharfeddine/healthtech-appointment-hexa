import { DataSource, Repository } from 'typeorm';
import { Appointment } from '../../../domain/appointment.entity';
import { AppointmentStatus } from '../../../domain/appointment-status.enum';
import { AppointmentOrmEntity } from './appointment.orm-entity';
import { createTestDataSource } from './typeorm-test.datasource';
import { TypeOrmAppointmentRepository } from './typeorm-appointment.repository';

describe('TypeOrmAppointmentRepository integration', () => {
  let dataSource: DataSource;
  let ormRepository: Repository<AppointmentOrmEntity>;
  let repository: TypeOrmAppointmentRepository;

  const APPOINTMENT_ID = '11111111-1111-4111-8111-111111111111';
  const UNKNOWN_ID = '99999999-9999-4999-8999-999999999999';

  beforeAll(async () => {
    dataSource = createTestDataSource();
    await dataSource.initialize();
    ormRepository = dataSource.getRepository(AppointmentOrmEntity);
    repository = new TypeOrmAppointmentRepository(ormRepository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await ormRepository.clear();
  });

  it('should save and find an appointment by id', async () => {
    const appointment = new Appointment(
      APPOINTMENT_ID,
      'patient-1',
      'doctor-1',
      new Date('2026-04-20T09:00:00.000Z'),
      AppointmentStatus.SCHEDULED,
    );

    await repository.save(appointment);

    const found = await repository.findById(APPOINTMENT_ID);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(APPOINTMENT_ID);
    expect(found?.patientId).toBe('patient-1');
    expect(found?.practitionerId).toBe('doctor-1');
    expect(found?.scheduledAt.toISOString()).toBe('2026-04-20T09:00:00.000Z');
    expect(found?.status).toBe(AppointmentStatus.SCHEDULED);
  });

  it('should return null when appointment does not exist', async () => {
    const found = await repository.findById(UNKNOWN_ID);

    expect(found).toBeNull();
  });

  it('should return true when a scheduled appointment exists for practitioner and slot', async () => {
    const scheduledAt = new Date('2026-04-20T09:00:00.000Z');

    await repository.save(
      new Appointment(
        APPOINTMENT_ID,
        'patient-1',
        'doctor-1',
        scheduledAt,
        AppointmentStatus.SCHEDULED,
      ),
    );

    const exists = await repository.existsByPractitionerIdAndScheduledAt(
      'doctor-1',
      scheduledAt,
    );

    expect(exists).toBe(true);
  });

  it('should return false when appointment exists but is canceled', async () => {
    const scheduledAt = new Date('2026-04-20T09:00:00.000Z');

    await repository.save(
      new Appointment(
        APPOINTMENT_ID,
        'patient-1',
        'doctor-1',
        scheduledAt,
        AppointmentStatus.CANCELED,
      ),
    );

    const exists = await repository.existsByPractitionerIdAndScheduledAt(
      'doctor-1',
      scheduledAt,
    );

    expect(exists).toBe(false);
  });
});