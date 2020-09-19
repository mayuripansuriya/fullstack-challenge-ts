import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { JobService } from "../job.service";
import { Job } from "../job.entity";
import { ShiftService } from "../../shift/shift.service";
import { ShiftModule } from "../../shift/shift.module";
import { Shift } from "../../shift/shift.entity";

describe("JobService", () => {
  let jobService: JobService;
  let shiftService: ShiftService;
  let jobRepository: Repository<Job>;
  let shiftRepository: Repository<Shift>;
  const uuid = "5bc3cd36-1f28-4acb-9443-5dc58f0822bc";
  const startDate = new Date();
  const endDate = startDate.setDate(startDate.getDate() + 2);

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
        JobService,
        ShiftService,
        {
          provide: getRepositoryToken(Job),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Shift),
          useClass: Repository,
        },
      ],
    }).compile();

    jobRepository = moduleFixture.get<Repository<Job>>(getRepositoryToken(Job));
    shiftRepository = moduleFixture.get<Repository<Shift>>(
      getRepositoryToken(Shift)
    );
    jobService = moduleFixture.get(JobService);
    shiftService = moduleFixture.get(ShiftService);
  });

  it("should be defined", async () => {
    expect(jobService).toBeDefined();
    expect(shiftService).toBeDefined();
  });

  describe("createJob", () => {
    it("should create a new job with shifts", async () => {
      const job = new Job();

      jest.spyOn(jobRepository, "save").mockResolvedValue(job);
      await jobService.createJob(uuid, {
        start: new Date(),
        end: startDate,
      });
      expect(jobRepository.save).toHaveBeenCalledTimes(1);
    });

    it("should throw error for date validation", async () => {
      const job = new Job();

      jest.spyOn(jobRepository, "save").mockResolvedValue(job);

      await expect(
        jobService.createJob(uuid, {
          start: new Date(),
          end: new Date(),
          shiftStartTime: "02:00",
          shiftEndTime: "03:00",
        })
      ).rejects.toThrow();

      expect(jobRepository.save).rejects.toThrow();
    });

    it("should throw error for time validation", async () => {
      const job = new Job();

      jest.spyOn(jobRepository, "save").mockResolvedValue(job);

      await expect(
        jobService.createJob(uuid, {
          start: new Date(),
          end: startDate,
          shiftStartTime: "02:00",
          shiftEndTime: "03:00",
        })
      ).rejects.toThrow();

      expect(jobRepository.save).rejects.toThrow();
    });
  });

  describe("get", () => {
    it("should get a job", async () => {
      const job = new Job();
      jest.spyOn(jobRepository, "findOneOrFail").mockResolvedValue(job);
      await jobService.get(uuid);
      expect(jobRepository.findOneOrFail).toHaveBeenCalledWith(uuid);
    });

    it("should throw an error if fetching job fails", async () => {
      jest.spyOn(jobRepository, "findOneOrFail").mockRejectedValue(new Error());

      await expect(jobService.get(uuid)).rejects.toThrow();
    });
  });

  describe("getJobs", () => {
    it("should get jobs", async () => {
      const job = new Job();
      jest.spyOn(jobRepository, "find").mockResolvedValue([job]);
      await jobService.getJobs();
      expect(jobRepository.find).toHaveBeenCalled();
    });
  });

  describe("cancelJob", () => {
    it("should cancel a job", async () => {
      const job = new Job();
      jest.spyOn(jobRepository, "save").mockResolvedValue(job);
      const shift = new Shift();
      jest.spyOn(shiftRepository, "update").mockImplementation();
      await shiftService.cancelAllShifts(uuid);

      await jobService.cancelJob(uuid);
      expect(jobRepository.save).toHaveBeenCalledWith({
        id: uuid,
        cancelledAt: new Date(),
      });
    });
  });
});
