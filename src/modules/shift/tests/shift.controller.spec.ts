import { Test } from "@nestjs/testing";
import { ShiftController } from "../shift.controller";
import { ShiftService } from "../shift.service";
import { Shift } from "../shift.entity";
import { BookTalentRequest } from "../dto/BookTalentRequest";

jest.mock("../shift.service");

describe("ShiftController", () => {
  let shiftController: ShiftController;
  let shiftService: jest.Mocked<ShiftService>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [ShiftController],
      providers: [ShiftService],
    }).compile();

    shiftController = moduleFixture.get(ShiftController);
    shiftService = moduleFixture.get(ShiftService);
  });

  it("should be defined", async () => {
    expect(shiftController).toBeDefined();
  });

  it("should get shifts from given uuid", async () => {
    const jobId = "1234";
    const shifts = [new Shift(), new Shift()];
    jest.spyOn(shiftService, "getShifts").mockResolvedValue(shifts);
    await shiftController.getShifts(jobId);
    expect(shiftService.getShifts).toHaveBeenCalledWith(jobId);
  });

  it("should book a talent", async () => {
    //We can use Faker package here
    const shiftId = "1234";
    const talentId = "1234";

    const dto: BookTalentRequest = {
      talent: talentId,
    };

    const talent = {
      ...dto,
    };

    jest.spyOn(shiftService, "bookTalent").mockResolvedValue();
    await shiftController.bookTalent(shiftId, talent);
    expect(shiftService.bookTalent).toHaveBeenCalledWith(shiftId, talentId);
  });

  it("should cancel a shift", async () => {
    const shiftId = "1234";
    const shift = new Shift();
    jest.spyOn(shiftService, "get").mockResolvedValue(shift);
    jest.spyOn(shiftService, "cancelShift").mockResolvedValue(shift);
    await shiftController.cancelShift(shiftId);
    expect(shiftService.cancelShift).toHaveBeenCalledWith(shiftId);
  });

  it("should throw error if no shift", async () => {
    const shiftId = "1234";
    jest.spyOn(shiftService, "get").mockRejectedValue(new Error());
    await expect(shiftController.cancelShift(shiftId)).rejects.toThrow();
  });

  it("should cancel shifts for a talent", async () => {
    const talentId = "1234";
    const shifts = [new Shift()];
    jest.spyOn(shiftService, "cancelShiftsForTalent").mockResolvedValue(shifts);
    await shiftController.cancelShiftsForTalent(talentId);
    expect(shiftService.cancelShiftsForTalent).toHaveBeenCalledWith(talentId);
  });
});
