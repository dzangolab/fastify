import type { ApiConfig } from "@dzangolab/fastify-config";
declare const validatePassword: (password: string, config: ApiConfig) => {
    message: string;
    success: boolean;
} | {
    success: boolean;
    message?: undefined;
};
export default validatePassword;
//# sourceMappingURL=password.d.ts.map