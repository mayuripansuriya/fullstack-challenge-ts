export class GetShiftResponse {
  id: string;
  talentId: string;
  jobId: string;
  start: Date;
  end: Date;
  cancelledAt: Date;

  constructor(
    id: string,
    talentId: string,
    jobId: string,
    start: Date,
    end: Date,
    cancelledAt: Date
  ) {
    this.id = id;
    this.talentId = talentId;
    this.jobId = jobId;
    this.start = start;
    this.end = end;
    this.cancelledAt = cancelledAt;
  }
}
