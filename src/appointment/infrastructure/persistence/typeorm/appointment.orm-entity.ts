import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AppointmentStatus } from '../../../domain/appointment-status.enum';

@Entity({ name: 'appointments' })
export class AppointmentOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  patientId: string;

  @Column({ type: 'varchar', length: 255 })
  practitionerId: string;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status: AppointmentStatus;
}