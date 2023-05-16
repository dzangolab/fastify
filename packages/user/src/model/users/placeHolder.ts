import type { User } from "../../types";
import type { ApiConfig } from "@dzangolab/fastify-config";

const placeHolder = (config: ApiConfig, user: User): boolean => {
  if (config.user.features?.check) {
    return config.user.features.check(user);
  }

  return false;
};

export default placeHolder;
