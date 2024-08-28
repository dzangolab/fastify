interface CustomApiErrorType {
    message: string;
    name: string;
    statusCode: number;
}
declare class CustomApiError extends Error {
    statusCode: number;
    constructor({ message, name, statusCode }: CustomApiErrorType);
}
export default CustomApiError;
export type { CustomApiErrorType };
//# sourceMappingURL=customApiError.d.ts.map