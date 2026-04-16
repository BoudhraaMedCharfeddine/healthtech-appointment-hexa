import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class BookAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  practitionerId: string;

  @IsDateString()
  scheduledAt: string;
}