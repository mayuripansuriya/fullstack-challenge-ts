import {
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  VersionColumn,
  UpdateDateColumn,
  Entity,
} from "typeorm";
import { Job } from "../job/job.entity";

@Entity()
export class Shift {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @VersionColumn()
  version: number;

  @ManyToOne(
    () => Job,
    (job) => job.shifts
  )
  job: Job;

  @Column()
  jobId: string;

  @Column({ nullable: true })
  talentId: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
