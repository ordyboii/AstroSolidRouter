import { inferRouterOutputs, initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const appRouter = t.router({
  example: t.procedure.query(() => "Hello from server")
});

export type AppRouter = typeof appRouter;
export type AppRouterTypes = inferRouterOutputs<typeof appRouter>;
