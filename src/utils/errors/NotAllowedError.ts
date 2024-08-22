export default class NotAllowedError extends Error {
  public data: any;

  constructor({ data, message } : { data: any, message: string }) {
    super(message);
    this.name = "NotAllowedError"
    this.data = data
  }
}