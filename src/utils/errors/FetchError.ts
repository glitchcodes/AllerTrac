export default class FetchError extends Error {
  public data: any;
  public statusCode: number;

  constructor({ data, message, statusCode } : { data: any, message: string, statusCode: number }) {
    super(message);
    this.name = "FetchError"
    this.data = data
    this.statusCode = statusCode;
  }
}