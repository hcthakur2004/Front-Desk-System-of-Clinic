import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Patient } from '../../patients/entities/patient.entity';

export enum AppointmentStatus {
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appointmentDate: Date;

  @Column({
    type: 'text',
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column()
  doctorId: string;

  @ManyToOne(() => Patient, patient => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}