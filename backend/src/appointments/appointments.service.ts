import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { CreateAppointmentDto, FilterAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private doctorsService: DoctorsService,
    private patientsService: PatientsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, patientId } = createAppointmentDto;
    
    // Verify doctor and patient exist
    await this.doctorsService.findOne(doctorId);
    await this.patientsService.findOne(patientId);
    
    const appointment = this.appointmentsRepository.create(createAppointmentDto);
    return this.appointmentsRepository.save(appointment);
  }

  async findAll(filterDto: FilterAppointmentDto = {}): Promise<Appointment[]> {
    const { doctorId, patientId, startDate, endDate, status } = filterDto;
    const whereClause: any = {};

    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    if (patientId) {
      whereClause.patientId = patientId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.appointmentDate = Between(new Date(startDate), new Date(endDate));
    }

    return this.appointmentsRepository.find({
      where: whereClause,
      relations: ['doctor', 'patient'],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });
    
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (updateAppointmentDto.doctorId) {
      await this.doctorsService.findOne(updateAppointmentDto.doctorId);
    }
    
    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentsRepository.save(appointment);
  }
}