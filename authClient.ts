import { Auth, AUTH_STRATEGIES } from "./packages/auth";

// TODO: add process.env vars
// related https://github.com/nuxt/framework/issues/3317
const authProfileId = "";
const apiEndpoint = "";

/* Initiate the auth client */
export const authClient = Auth.createClient(
  {
    strategy: AUTH_STRATEGIES.WEB_8BASE_NATIVE,
  },
  {
    authProfileId,
    apiEndpoint,
  }
);
