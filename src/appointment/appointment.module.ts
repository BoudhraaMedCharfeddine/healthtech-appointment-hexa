import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentRepository,
} from './application/ports/appointment.repository';
import { BookAppointmentUseCase } from './application/use-cases/book-appointment.use-case';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment.use-case';
import {
  BOOK_APPOINTMENT_USE_CASE,
  CANCEL_APPOINTMENT_USE_CASE,
} from './application/use-cases/use-case.tokens';
import { AppointmentController } from './infrastructure/http/appointment.controller';
import { ApplicationErrorFilter } from './infrastructure/http/filters/application-error.filter';
import { AppointmentOrmEntity } from './infrastructure/persistence/typeorm/appointment.orm-entity';
import { TypeOrmAppointmentRepository } from './infrastructure/persistence/typeorm/typeorm-appointment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentOrmEntity])],
  controllers: [AppointmentController],
  providers: [
    TypeOrmAppointmentRepository,
    {
      provide: APPOINTMENT_REPOSITORY,
      useExisting: TypeOrmAppointmentRepository,
    },
    {
      provide: BOOK_APPOINTMENT_USE_CASE,
      inject: [APPOINTMENT_REPOSITORY],
      useFactory: (appointmentRepository: AppointmentRepository) =>
        new BookAppointmentUseCase(appointmentRepository),
    },
    {
      provide: CANCEL_APPOINTMENT_USE_CASE,
      inject: [APPOINTMENT_REPOSITORY],
      useFactory: (appointmentRepository: AppointmentRepository) =>
        new CancelAppointmentUseCase(appointmentRepository),
    },
    {
      provide: APP_FILTER,
      useClass: ApplicationErrorFilter,
    },
  ],
})
export class AppointmentModule {}