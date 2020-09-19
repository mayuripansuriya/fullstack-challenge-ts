import { Test } from "@nestjs/testing";
import { JobController } from "../job.controller";
import { JobService } from "../job.service";
import { Job } from "../job.entity";
import { JobRequest } from "../dto/JobRequest";
import { Shift } from "../../shift/shift.entity";
import { v4 } from "uuid";

jest.mock("../job.service");
jest.mock("uuid");

describe("JobController", () => {
  let jobController: JobController;
  let jobService: jest.Mocked<JobService>;

  const companyId = "1234";
  const start = new Date();
  const end = new Date();
  const dto: JobRequest = {
    companyId: companyId,
    start: start,
    end: end,
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [JobController],
      providers: [JobService],
    }).compile();

    jobController = moduleFixture.get(JobController);
    jobService = moduleFixture.get(JobService);
  });

  it("should be defined", async () => {
    expect(jobController).toBeDefined();
  });

  it("should create job", async () => {
    const job = new Job();
    const jobId = "1234";
    const shift = new Shift();
    const jobObject = {
      ...job,
      ...shift,
      ...dto,
    };

    v4.mockImplementation(() => jobId);
    jest.spyOn(jobService, "createJob").mockResolvedValue(jobObject);
    await jobController.requestJob(dto);
    expect(jobService.createJob).toHaveBeenCalledWith(jobId, {
      companyId,
      start,
      end,
    });
  });

  it("should cancel a job", async () => {
    const jobId = "1234";
    const job = new Job();
    jest.spyOn(jobService, "get").mockResolvedValue(job);
    jest.spyOn(jobService, "cancelJob").mockResolvedValue(job);
    await jobController.cancelJob(jobId);
    expect(jobService.cancelJob).toHaveBeenCalledWith(jobId);
  });

  it("should throw error if no job", async () => {
    const jobId = "1234";
    jest.spyOn(jobService, "get").mockRejectedValue(new Error());
    await expect(jobController.cancelJob(jobId)).rejects.toThrow();
  });
});
