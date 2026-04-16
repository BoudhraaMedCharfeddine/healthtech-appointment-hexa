import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentRepository } from '../../../application/ports/appointment.repository';
import { Appointment } from '../../../domain/appointment.entity';
import { AppointmentStatus } from '../../../domain/appointment-status.enum';
import { AppointmentMapper } from './appointment.mapper';
import { AppointmentOrmEntity } from './appointment.orm-entity';

@Injectable()
export class TypeOrmAppointmentRepository implements AppointmentRepository {
  constructor(
    @InjectRepository(AppointmentOrmEntity)
    private readonly repository: Repository<AppointmentOrmEntity>,
  ) {}

  async save(appointment: Appointment): Promise<void> {
    const ormEntity = AppointmentMapper.toOrmEntity(appointment);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<Appointment | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return AppointmentMapper.toDomain(entity);
  }

  async existsByPractitionerIdAndScheduledAt(
    practitionerId: string,
    scheduledAt: Date,
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        practitionerId,
        scheduledAt,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    return count > 0;
  }
}