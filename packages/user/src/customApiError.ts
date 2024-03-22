interface CustomApiErrorType {
  message: string;
  name: string;
  statusCode: number;
}

class CustomApiError extends Error {
  public statusCode: number;
  public message: string;

  constructor({ message, name, statusCode }: CustomApiErrorType) {
    super(message);
    this.message = message;
    this.name = name;
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomApiError.prototype);
  }
}

export default CustomApiError;

export type { CustomApiErrorType };
