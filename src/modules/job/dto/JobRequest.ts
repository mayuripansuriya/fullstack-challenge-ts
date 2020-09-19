import { IsNotEmpty, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class JobRequest {
  @IsNotEmpty()
  @IsUUID(4)
  companyId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  end: Date;
}
