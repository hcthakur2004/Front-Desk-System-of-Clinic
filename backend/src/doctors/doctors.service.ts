import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto, FilterDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async findAll(filterDto: FilterDoctorDto = {}): Promise<Doctor[]> {
    const { specialization, location, isAvailable } = filterDto;
    const query = this.doctorsRepository.createQueryBuilder('doctor');

    if (specialization) {
      query.andWhere('doctor.specialization = :specialization', { specialization });
    }

    if (location) {
      query.andWhere('doctor.location = :location', { location });
    }

    if (isAvailable !== undefined) {
      query.andWhere('doctor.isAvailable = :isAvailable', { isAvailable });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, updateDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.doctorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }
}