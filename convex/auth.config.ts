import { AuthConfig } from "convex/server";
export default {
  providers: [
    {
      domain: "https://superb-bluebird-92.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
