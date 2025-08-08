import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto, FilterAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterAppointmentDto) {
    return this.appointmentsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }

  @Patch(':id/status/completed')
  markAsCompleted(@Param('id') id: string) {
    return this.appointmentsService.updateStatus(id, AppointmentStatus.COMPLETED);
  }

  @Patch(':id/status/canceled')
  markAsCanceled(@Param('id') id: string) {
    return this.appointmentsService.updateStatus(id, AppointmentStatus.CANCELED);
  }
}