import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  HttpCode,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ResponseDto } from "../../utils/ResponseDto";
import { GetShiftsResponse } from "./dto/GetShiftsResponse";
import { GetShiftResponse } from "./dto/GetShiftResponse";
import { CancelShiftResponse } from "./dto/CancelShiftResponse";

import { ShiftService } from "./shift.service";
import { ValidationPipe } from "../ValidationPipe";
import { BookTalentRequest } from "./dto/BookTalentRequest";

@Controller("shift")
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get(":jobId")
  async getShifts(
    @Param("jobId", new ParseUUIDPipe()) jobId: string
  ): Promise<ResponseDto<GetShiftsResponse>> {
    const shifts = await this.shiftService.getShifts(jobId);
    return new ResponseDto<GetShiftsResponse>(
      new GetShiftsResponse(
        shifts.map((shift) => {
          return new GetShiftResponse(
            shift.id,
            shift.talentId,
            shift.jobId,
            shift.startTime,
            shift.endTime,
            shift.cancelledAt
          );
        })
      )
    );
  }

  @Patch(":shiftId/book")
  @HttpCode(204)
  async bookTalent(
    @Param("shiftId", new ParseUUIDPipe()) shiftId: string,
    @Body(new ValidationPipe<BookTalentRequest>()) dto: BookTalentRequest
  ): Promise<void> {
    this.shiftService.bookTalent(shiftId, dto.talent);
  }

  @Get(":shiftId/cancel")
  @HttpCode(200)
  async cancelShift(
    @Param("shiftId", new ParseUUIDPipe()) shiftId: string
  ): Promise<ResponseDto<CancelShiftResponse>> {
    const shift = await this.shiftService.get(shiftId);

    //check if shift is already cancelled
    if (shift.cancelledAt) {
      throw new HttpException(
        "Shift Already cancelled.",
        HttpStatus.BAD_REQUEST
      );
    }
    const data = await this.shiftService.cancelShift(shiftId);

    return new ResponseDto<CancelShiftResponse>(
      new CancelShiftResponse(data, "shift cancelled successfully")
    );
  }

  @Get("talent/:talentId/cancel")
  @HttpCode(200)
  async cancelShiftsForTalent(
    @Param("talentId", new ParseUUIDPipe()) talentId: string
  ): Promise<ResponseDto<CancelShiftResponse>> {
    await this.shiftService.cancelShiftsForTalent(talentId);
    return new ResponseDto<CancelShiftResponse>(
      new CancelShiftResponse(null, "shift cancelled successfully")
    );
  }
}
