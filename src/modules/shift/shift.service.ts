import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Shift } from "./shift.entity";

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly repository: Repository<Shift>
  ) {}

  public get(uuid: string): Promise<Shift> {
    return this.repository.findOneOrFail(uuid);
  }

  public async getShifts(uuid: string): Promise<Shift[]> {
    return this.repository.find({
      where: {
        jobId: uuid,
      },
    });
  }

  public async bookTalent(talent: string, shiftId: string): Promise<void> {
    this.repository.findOne(shiftId).then((shift) => {
      shift.talentId = talent;
      this.repository.save(shift);
    });
  }

  public async cancelShift(id: string): Promise<Shift> {
    return this.repository.save({ id, cancelledAt: new Date() });
  }

  public cancelAllShifts(uuid: string): Promise<UpdateResult> {
    return this.repository.update({ jobId: uuid }, { cancelledAt: new Date() });
  }
}
