import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { v4 as UUIDv4 } from "uuid";
import { JobService } from "./job.service";
import { ResponseDto } from "../../utils/ResponseDto";
import { ValidationPipe } from "../ValidationPipe";
import { JobRequest } from "./dto/JobRequest";
import { JobRequestResponse } from "./dto/JobRequestResponse";
import { CancelJobResponse } from "./dto/CancelJobResponse";

@Controller("job")
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async requestJob(
    @Body(new ValidationPipe<JobRequest>())
    dto: JobRequest
  ): Promise<ResponseDto<JobRequestResponse>> {
    const job = await this.jobService.createJob(UUIDv4(), dto.start, dto.end);
    return new ResponseDto<JobRequestResponse>(new JobRequestResponse(job.id));
  }

  @Get(":jobId/cancel")
  @HttpCode(200)
  async cancelJob(
    @Param("jobId", new ParseUUIDPipe()) jobId: string
  ): Promise<ResponseDto<CancelJobResponse>> {
    const job = await this.jobService.get(jobId);

    //Check if job is already cancelled
    if (job.cancelledAt) {
      throw new HttpException(
        "Job is already cancelled!",
        HttpStatus.BAD_REQUEST
      );
    }

    //Actually cancels job
    const data = this.jobService.cancelJob(jobId);

    //TODO pass data in response
    if (data) {
      return new ResponseDto<CancelJobResponse>(
        new CancelJobResponse("Job cancelled successfully")
      );
    }
  }
}
