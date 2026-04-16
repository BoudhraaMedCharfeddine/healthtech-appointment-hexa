import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationError } from '../../../application/errors/application.error';
import { AppointmentNotFoundError } from '../../../application/errors/appointment-not-found.error';
import { PastAppointmentBookingError } from '../../../application/errors/past-appointment-booking.error';
import { SlotAlreadyBookedError } from '../../../application/errors/slot-already-booked.error';
import { AppointmentAlreadyCanceledError } from '../../../domain/errors/appointment-already-canceled.error';
import { CannotCancelPastAppointmentError } from '../../../domain/errors/cannot-cancel-past-appointment.error';
import { InvalidScheduledAtError } from '../../../domain/errors/invalid-scheduled-at.error';
import { PatientIdRequiredError } from '../../../domain/errors/patient-id-required.error';
import { PractitionerIdRequiredError } from '../../../domain/errors/practitioner-id-required.error';

@Catch(
  ApplicationError,
  AppointmentAlreadyCanceledError,
  CannotCancelPastAppointmentError,
  PatientIdRequiredError,
  PractitionerIdRequiredError,
  InvalidScheduledAtError,
)
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, error } = this.mapException(exception);

    response.status(statusCode).json({
      statusCode,
      error,
      message: exception instanceof Error ? exception.message : 'Unknown error',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private mapException(exception: unknown): {
    statusCode: number;
    error: string;
  } {
    if (exception instanceof AppointmentNotFoundError) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
      };
    }

    if (
      exception instanceof SlotAlreadyBookedError ||
      exception instanceof AppointmentAlreadyCanceledError
    ) {
      return {
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
      };
    }

    if (
      exception instanceof PastAppointmentBookingError ||
      exception instanceof CannotCancelPastAppointmentError ||
      exception instanceof PatientIdRequiredError ||
      exception instanceof PractitionerIdRequiredError ||
      exception instanceof InvalidScheduledAtError
    ) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    };
  }
}