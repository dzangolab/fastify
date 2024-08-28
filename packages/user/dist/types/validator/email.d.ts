import type { ApiConfig } from "@dzangolab/fastify-config";
declare const validateEmail: (email: string, config: ApiConfig) => {
    message: string;
    success: boolean;
} | {
    success: boolean;
    message?: undefined;
};
export default validateEmail;
//# sourceMappingURL=email.d.ts.map