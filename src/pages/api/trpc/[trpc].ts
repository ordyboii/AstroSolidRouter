import type { APIRoute } from "astro";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "server/router";

const handler: APIRoute = ({ request }) =>
  fetchRequestHandler({
    req: request,
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: () => ({}),
    batching: { enabled: true }
  });

export { handler as get, handler as post };
