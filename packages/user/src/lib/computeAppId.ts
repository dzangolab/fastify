import type { ApiConfig } from "@dzangolab/fastify-config";

const computeAppId = (config: ApiConfig, origin: string): number => {
  const app = config.apps?.find((app) => app.origin === origin);

  if (!app) {
    throw new Error("App does not exist");
  }

  return app.id;
};

export default computeAppId;
