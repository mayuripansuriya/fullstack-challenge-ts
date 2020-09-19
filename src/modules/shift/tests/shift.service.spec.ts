import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { ShiftService } from "../shift.service";
import { Shift } from "../shift.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ShiftService", () => {
  let shiftService: ShiftService;
  let shiftRepository: Repository<Shift>;
  const uuid = "5bc3cd36-1f28-4acb-9443-5dc58f0822bc";

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
        ShiftService,
        {
          provide: getRepositoryToken(Shift),
          useClass: Repository,
        },
      ],
    }).compile();

    shiftRepository = moduleFixture.get<Repository<Shift>>(
      getRepositoryToken(Shift)
    );

    shiftService = moduleFixture.get(ShiftService);
  });

  it("should be defined", async () => {
    expect(shiftService).toBeDefined();
  });

  describe("getShifts", () => {
    it("should find with valid shift uuid", async () => {
      jest
        .spyOn(shiftRepository, "findOneOrFail")
        .mockResolvedValue(new Shift());

      await shiftService.get(uuid);

      expect(shiftRepository.findOneOrFail).toHaveBeenCalledWith(uuid);
    });

    it("should throw an error if fetching shift fails", async () => {
      jest
        .spyOn(shiftRepository, "findOneOrFail")
        .mockRejectedValue(new Error());

      await expect(shiftService.get(uuid)).rejects.toThrow();
    });
  });

  describe("cancelShiftsForTalent", () => {
    it("should find with valid shift uuid", async () => {
      const talentId = uuid;

      const shift1 = new Shift();
      const shift2 = new Shift();
      const shifts = [shift1, shift2];

      jest.spyOn(shiftRepository, "find").mockResolvedValue(shifts);
      jest.spyOn(shiftRepository, "save").mockResolvedValue(shift1);
      await shiftService.cancelShiftsForTalent(talentId);
      expect(shiftRepository.save).toHaveBeenCalledTimes(shifts.length * 2);
    });
  });

  describe("getShiftsForTalent", () => {
    it("should find shifts for a talent", async () => {
      const talentId = uuid;

      const shift1 = new Shift();
      const shift2 = new Shift();
      const shifts = [shift1, shift2];

      jest.spyOn(shiftRepository, "find").mockResolvedValue(shifts);
      await shiftService.getShiftsForTalent(talentId);
      expect(shiftRepository.find).toHaveBeenCalledWith({
        where: {
          talentId,
          cancelledAt: null,
        },
      });
    });
  });

  describe("bookTalent", () => {
    it("should add a talent to a shift", async () => {
      const shiftId = uuid;
      const talentId = "1234";

      const shift = new Shift();

      jest.spyOn(shiftRepository, "findOne").mockResolvedValue(shift);
      jest.spyOn(shiftRepository, "save").mockResolvedValue(shift);
      await shiftService.bookTalent(shiftId, talentId);
      expect(shiftRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: shiftId,
        },
      });
    });
  });

  describe("cancelShift", () => {
    it("should cancel a shift", async () => {
      const shift = new Shift();
      jest.spyOn(shiftRepository, "save").mockResolvedValue(shift);
      await shiftService.cancelShift(uuid);
      expect(shiftRepository.save).toHaveBeenCalledWith({
        id: uuid,
        cancelledAt: new Date(),
      });
    });
  });

  describe("cancelAllShifts", () => {
    it("should cancel a shift", async () => {
      const shift = new Shift();
      jest.spyOn(shiftRepository, "update").mockImplementation();
      await shiftService.cancelAllShifts(uuid);
      expect(shiftRepository.update).toHaveBeenCalledWith(
        { jobId: uuid },
        { cancelledAt: new Date() }
      );
    });
  });
});
