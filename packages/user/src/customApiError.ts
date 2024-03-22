interface CustomApiErrorType {
  message: string;
  name: string;
  statusCode: number;
}

class CustomApiError extends Error {
  public statusCode: number;

  constructor({ message, name, statusCode }: CustomApiErrorType) {
    super(message);
    this.message = message;
    this.name = name;
    this.statusCode = statusCode;
  }
}

export default CustomApiError;

export type { CustomApiErrorType };
