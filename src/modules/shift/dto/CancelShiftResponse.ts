export class CancelShiftResponse {
  data: object;
  message: string;

  constructor(data: object, message: string) {
    this.data = data;
    this.message = message;
  }
}
