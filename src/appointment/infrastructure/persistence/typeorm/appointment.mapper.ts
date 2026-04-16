import { Appointment } from '../../../domain/appointment.entity';
import { AppointmentOrmEntity } from './appointment.orm-entity';

export class AppointmentMapper {
  static toDomain(ormEntity: AppointmentOrmEntity): Appointment {
    return new Appointment(
      ormEntity.id,
      ormEntity.patientId,
      ormEntity.practitionerId,
      ormEntity.scheduledAt,
      ormEntity.status,
    );
  }

  static toOrmEntity(domain: Appointment): AppointmentOrmEntity {
    const ormEntity = new AppointmentOrmEntity();
    ormEntity.id = domain.id;
    ormEntity.patientId = domain.patientId;
    ormEntity.practitionerId = domain.practitionerId;
    ormEntity.scheduledAt = domain.scheduledAt;
    ormEntity.status = domain.status;
    return ormEntity;
  }
}