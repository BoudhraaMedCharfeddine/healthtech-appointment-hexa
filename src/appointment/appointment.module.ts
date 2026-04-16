import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './infrastructure/http/appointment.controller';
import { ApplicationErrorFilter } from './infrastructure/http/filters/application-error.filter';
import { BookAppointmentUseCase } from './application/use-cases/book-appointment.use-case';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment.use-case';
import {
  APPOINTMENT_REPOSITORY,
} from './application/ports/appointment.repository';
import { AppointmentOrmEntity } from './infrastructure/persistence/typeorm/appointment.orm-entity';
import { TypeOrmAppointmentRepository } from './infrastructure/persistence/typeorm/typeorm-appointment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentOrmEntity])],
  controllers: [AppointmentController],
  providers: [
    BookAppointmentUseCase,
    CancelAppointmentUseCase,
    TypeOrmAppointmentRepository,
    {
      provide: APPOINTMENT_REPOSITORY,
      useExisting: TypeOrmAppointmentRepository,
    },
    {
      provide: APP_FILTER,
      useClass: ApplicationErrorFilter,
    },
  ],
})
export class AppointmentModule {}