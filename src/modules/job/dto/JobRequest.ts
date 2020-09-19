import {
  IsNotEmpty,
  IsDate,
  IsUUID,
  MinDate,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { MomentInput } from "moment";

export class JobRequest {
  @IsNotEmpty()
  @IsUUID(4)
  companyId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date(), {
    message: "A Job start date must not be a past date",
  })
  start: Date;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(), {
    message: "A Job end date must not be a past date",
  })
  @IsNotEmpty()
  end: Date;

  @IsOptional()
  shiftStartTime?: MomentInput;

  @IsOptional()
  shiftEndTime?: MomentInput;
}
