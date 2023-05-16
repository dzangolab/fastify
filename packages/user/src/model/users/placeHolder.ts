import type { User } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const placeHolder = (config: ApiConfig, user: User) => {
  if (config.user.features?.isUserDisabled) {
    return config.user.features.isUserDisabled(user);
  }

  return true;
};

export default placeHolder;
