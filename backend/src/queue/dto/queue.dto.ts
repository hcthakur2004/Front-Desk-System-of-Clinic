import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { QueuePriority, QueueStatus } from '../entities/queue.entity';

export class CreateQueueDto {
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateQueueDto {
  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;

  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class FilterQueueDto {
  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;

  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;
}