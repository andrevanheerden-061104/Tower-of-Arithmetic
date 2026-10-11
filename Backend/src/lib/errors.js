// A problem that the player can be told about, with the HTTP status to send.
export class AppError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}
