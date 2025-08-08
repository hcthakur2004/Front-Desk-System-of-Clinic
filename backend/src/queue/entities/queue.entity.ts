import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Patient } from '../../patients/entities/patient.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  WITH_DOCTOR = 'with_doctor',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum QueuePriority {
  NORMAL = 'normal',
  URGENT = 'urgent',
}

@Entity('queue')
export class Queue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  queueNumber: number;

  @Column({
    type: 'text',
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({
    type: 'text',
    default: QueuePriority.NORMAL,
  })
  priority: QueuePriority;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @ManyToOne(() => Doctor, { nullable: true })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ nullable: true })
  doctorId: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}