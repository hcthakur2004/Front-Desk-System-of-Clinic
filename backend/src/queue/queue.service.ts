import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { CreateQueueDto, FilterQueueDto, UpdateQueueDto } from './dto/queue.dto';
import { Queue, QueueStatus } from './entities/queue.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    private patientsService: PatientsService,
    private doctorsService: DoctorsService,
  ) {}

  async create(createQueueDto: CreateQueueDto): Promise<Queue> {
    const { patientId, doctorId } = createQueueDto;
    
    // Verify patient exists
    await this.patientsService.findOne(patientId);
    
    // Verify doctor exists if provided
    if (doctorId) {
      await this.doctorsService.findOne(doctorId);
    }
    
    // Get the next queue number
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestQueue = await this.queueRepository.findOne({
      where: {
        createdAt: MoreThanOrEqual(today),
      },
      order: {
        queueNumber: 'DESC',
      },
    });
    
    const queueNumber = latestQueue ? latestQueue.queueNumber + 1 : 1;
    
    const queue = this.queueRepository.create({
      ...createQueueDto,
      queueNumber,
    });
    
    return this.queueRepository.save(queue);
  }

  async findAll(filterDto: FilterQueueDto = {}): Promise<Queue[]> {
    const { status, doctorId, priority } = filterDto;
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    return this.queueRepository.find({
      where: whereClause,
      relations: ['patient', 'doctor'],
      order: {
        priority: 'DESC',
        queueNumber: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Queue> {
    const queue = await this.queueRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    
    if (!queue) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }
    
    return queue;
  }

  async update(id: string, updateQueueDto: UpdateQueueDto): Promise<Queue> {
    const queue = await this.findOne(id);
    
    if (updateQueueDto.doctorId) {
      await this.doctorsService.findOne(updateQueueDto.doctorId);
    }
    
    Object.assign(queue, updateQueueDto);
    return this.queueRepository.save(queue);
  }

  async remove(id: string): Promise<void> {
    const result = await this.queueRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: QueueStatus): Promise<Queue> {
    const queue = await this.findOne(id);
    queue.status = status;
    return this.queueRepository.save(queue);
  }

  async getTodayQueue(): Promise<Queue[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.queueRepository.find({
      where: {
        createdAt: MoreThanOrEqual(today),
      },
      relations: ['patient', 'doctor'],
      order: {
        priority: 'DESC',
        queueNumber: 'ASC',
      },
    });
  }
}