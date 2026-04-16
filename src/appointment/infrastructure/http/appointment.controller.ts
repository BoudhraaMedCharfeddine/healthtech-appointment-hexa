import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import {
  BOOK_APPOINTMENT_USE_CASE,
  CANCEL_APPOINTMENT_USE_CASE,
} from '../../application/use-cases/use-case.tokens';
import { BookAppointmentUseCase } from '../../application/use-cases/book-appointment.use-case';
import { CancelAppointmentUseCase } from '../../application/use-cases/cancel-appointment.use-case';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(
    @Inject(BOOK_APPOINTMENT_USE_CASE)
    private readonly bookAppointmentUseCase: BookAppointmentUseCase,
    @Inject(CANCEL_APPOINTMENT_USE_CASE)
    private readonly cancelAppointmentUseCase: CancelAppointmentUseCase,
  ) {}

  @Post()
  async book(@Body() body: BookAppointmentDto) {
    return this.bookAppointmentUseCase.execute({
      patientId: body.patientId,
      practitionerId: body.practitionerId,
      scheduledAt: new Date(body.scheduledAt),
    });
  }

  @Delete(':id')
  async cancel(@Param('id') id: string) {
    return this.cancelAppointmentUseCase.execute({
      appointmentId: id,
    });
  }
}