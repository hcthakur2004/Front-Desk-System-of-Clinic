import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreatePatientDto, SearchPatientDto, UpdatePatientDto } from './dto/patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientsRepository.create(createPatientDto);
    return this.patientsRepository.save(patient);
  }

  async findAll(searchDto: SearchPatientDto = {}): Promise<Patient[]> {
    const { name, phone, email } = searchDto;
    const whereClause: any = {};

    if (name) {
      whereClause.name = Like(`%${name}%`);
    }

    if (phone) {
      whereClause.phone = phone;
    }

    if (email) {
      whereClause.email = email;
    }

    return this.patientsRepository.find({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientDto);
    return this.patientsRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }
}