import { Whatever } from "./types.js";

interface IError {
  message: string;
  extraInfo?: Whatever;
}

export class SystemError extends Error {
  extraInfo: IError["extraInfo"];

  constructor(error: IError) {
    super(error.message);

    // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, SystemError.prototype);

    this.extraInfo = error.extraInfo;
  }
}
