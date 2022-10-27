import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "server/router";

const getBaseUrl = () => {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  // assume localhost
  return `http://localhost:3000`;
};

export const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api` })]
});
