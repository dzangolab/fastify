import { BaseService, Service } from "@dzangolab/fastify-slonik";
import UserDeviceSqlFactory from "./sqlFactory";
import type { QueryResultRow } from "slonik";
declare class UserDeviceService<UserDevice extends QueryResultRow, UserDeviceCreateInput extends QueryResultRow, UserDeviceUpdateInput extends QueryResultRow> extends BaseService<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput> implements Service<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput> {
    get table(): string;
    get factory(): UserDeviceSqlFactory<UserDevice, UserDeviceCreateInput, UserDeviceUpdateInput>;
    create: (data: UserDeviceCreateInput) => Promise<UserDevice | undefined>;
    getByUserId: (userId: string) => Promise<UserDevice[] | undefined>;
    removeByDeviceToken: (deviceToken: string) => Promise<UserDevice | undefined>;
}
export default UserDeviceService;
//# sourceMappingURL=service.d.ts.map