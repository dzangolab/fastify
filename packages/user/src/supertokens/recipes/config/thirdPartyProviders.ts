import Apple from "supertokens-node/lib/build/recipe/thirdparty/providers/apple";
import Facebook from "supertokens-node/lib/build/recipe/thirdparty/providers/facebook";
import Github from "supertokens-node/lib/build/recipe/thirdparty/providers/github";
import Google from "supertokens-node/lib/build/recipe/thirdparty/providers/google";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { TypeProvider } from "supertokens-node/recipe/thirdpartyemailpassword";

const getThirdPartyProviders = (config: ApiConfig) => {
  const providersConfig = config.user.supertokens.providers;
  const providers: TypeProvider[] = [];

  const providerFunctions = [
    { name: "google", func: Google },
    { name: "github", func: Github },
    { name: "facebook", func: Facebook },
    { name: "apple", func: Apple },
  ];

  for (const provider of providerFunctions) {
    if (providersConfig?.[provider.name as never]) {
      providers.push(
        provider.func(providersConfig[provider.name as never] as never)
      );
    }
  }

  return providers;
};

export default getThirdPartyProviders;
