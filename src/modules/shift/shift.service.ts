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

  public async getShifts(uuid: string): Promise<Shift[]> {
    return this.repository.find({
      where: {
        jobId: uuid,
      },
    });
  }

  public get(uuid: string): Promise<Shift> {
    return this.repository.findOneOrFail(uuid);
  }

  public getShiftsForTalent(uuid: string): Promise<Shift[]> {
    return this.repository.find({
      where: {
        talentId: uuid,
        cancelledAt: null,
      },
    });
  }

  public bookTalent(shiftId: string, talent: string): Promise<void> {
    return this.repository.findOne({ where: { id: shiftId } }).then((shift) => {
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

  public async cancelShiftsForTalent(uuid: string): Promise<any> {
    const shifts = await this.getShiftsForTalent(uuid);
    shifts.map(({ jobId, startTime, endTime, id }) => {
      this.repository.save({
        jobId,
        startTime,
        endTime,
      });
      this.cancelShift(id);
    });
  }
}
