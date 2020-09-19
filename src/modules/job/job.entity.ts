import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Shift } from "../shift/shift.entity";

@Entity({ name: "job_process" })
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @VersionColumn()
  version: number;

  @Column()
  companyId: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @OneToMany(
    () => Shift,
    (shift) => shift.job,
    {
      cascade: true,
    }
  )
  shifts: Shift[];

  @Column({ nullable: true })
  cancelledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
