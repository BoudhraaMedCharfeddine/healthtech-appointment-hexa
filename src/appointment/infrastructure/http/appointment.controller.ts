import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { BookAppointmentUseCase } from '../../application/use-cases/book-appointment.use-case';
import { CancelAppointmentUseCase } from '../../application/use-cases/cancel-appointment.use-case';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly bookAppointmentUseCase: BookAppointmentUseCase,
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