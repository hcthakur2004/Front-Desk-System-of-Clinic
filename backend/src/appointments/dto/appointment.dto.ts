import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  appointmentDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsUUID()
  doctorId: string;

  @IsNotEmpty()
  @IsUUID()
  patientId: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;
}

export class FilterAppointmentDto {
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}