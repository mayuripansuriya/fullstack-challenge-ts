import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as UUIDv4 } from "uuid";
import { eachDayOfInterval } from "date-fns";
import { Repository } from "typeorm";
import { Job } from "./job.entity";
import { Shift } from "../shift/shift.entity";
import { ShiftService } from "../shift/shift.service";

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly shiftService: ShiftService
  ) {}

  async createJob(uuid: string, date1: Date, date2: Date): Promise<Job> {
    date1.setUTCHours(8);
    date2.setUTCHours(17);
    const job = new Job();
    job.id = uuid;
    job.companyId = UUIDv4();
    job.startTime = date1;
    job.endTime = date2;

    job.shifts = eachDayOfInterval({ start: date1, end: date2 }).map((day) => {
      const startTime = new Date(day);
      startTime.setUTCHours(8);
      const endTime = new Date(day);
      endTime.setUTCHours(17);
      const shift = new Shift();
      shift.id = UUIDv4();
      shift.job = job;
      shift.startTime = startTime;
      shift.endTime = endTime;
      return shift;
    });

    return this.jobRepository.save(job);
  }

  public async get(uuid: string): Promise<Job> {
    return this.jobRepository.findOneOrFail(uuid);
  }

  public async getJobs(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  public async cancelJob(id: string): Promise<Job> {
    await this.shiftService.cancelAllShifts(id);
    return await this.jobRepository.save({
      id,
      cancelledAt: new Date(),
    });
  }
}
