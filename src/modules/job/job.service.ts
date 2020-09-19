import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as UUIDv4 } from "uuid";
import { eachDayOfInterval } from "date-fns";
import { Repository } from "typeorm";
import { Job } from "./job.entity";
import { Shift } from "../shift/shift.entity";
import { ShiftService } from "../shift/shift.service";
import * as moment from "moment";

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly shiftService: ShiftService
  ) {}

  async createJob(
    uuid: string,
    {
      start,
      end,
      shiftStartTime,
      shiftEndTime,
    }: {
      start: Date;
      end: Date;
      shiftStartTime?: moment.MomentInput;
      shiftEndTime?: moment.MomentInput;
    }
  ): Promise<Job> {
    let startHour = 8;
    let endHour = 17;
    let startMinute = 0;
    let endMinute = 0;
    if (!moment(start).isBefore(end)) {
      throw new HttpException(
        "end date should be after start date",
        HttpStatus.CONFLICT
      );
    }

    if (shiftStartTime && shiftEndTime) {
      let startTime = moment(shiftStartTime, "HH:mm:ss a");
      let endTime = moment(shiftEndTime, "HH:mm:ss a");
      // calculate total duration
      let duration = moment.duration(endTime.diff(startTime));
      // duration in hours
      let hours = parseInt(String(duration.asHours()));
      // duration in minutes
      if (hours > 8 || hours < 2) {
        throw new HttpException(
          "shift duration cannot be more than 8 hours or less than 2 hours",
          HttpStatus.CONFLICT
        );
      }
      startHour = startTime.get("hour");
      endHour = endTime.get("hour");

      startMinute = startTime.get("minute");
      endMinute = endTime.get("minute");
    }

    start.setUTCHours(startHour);
    end.setUTCHours(endHour);
    start.setUTCMinutes(startMinute);
    end.setUTCMinutes(endMinute);
    const job = new Job();
    job.id = uuid;
    job.companyId = UUIDv4();
    job.startTime = start;
    job.endTime = end;

    job.shifts = eachDayOfInterval({ start: start, end: end }).map((day) => {
      const startTime = new Date(day);
      startTime.setUTCHours(startHour);
      startTime.setUTCMinutes(startMinute);
      const endTime = new Date(day);
      endTime.setUTCHours(endHour);
      endTime.setUTCMinutes(endMinute);
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
