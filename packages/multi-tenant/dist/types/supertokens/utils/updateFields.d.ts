import type { Tenant } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
interface FormField {
    id: string;
    value: string;
}
declare const updateFields: (config: ApiConfig, formFields: FormField[], tenant: Tenant | undefined) => FormField[];
export default updateFields;
//# sourceMappingURL=updateFields.d.ts.map