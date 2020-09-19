import { GetShiftResponse } from './GetShiftResponse';

export class GetShiftsResponse {
  shifts: GetShiftResponse[];

  constructor(shifts: GetShiftResponse[]) {
    this.shifts = shifts;
  }
}
