import { inferRouterOutputs, initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.create();

export const appRouter = t.router({
  example: t.procedure.query(() => "Hello from server"),
  me: t.procedure.query(() => {
    const username = "jake";
    if (username === "jake")
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are unauthorized"
      });
    return { username };
  })
});

export type AppRouter = typeof appRouter;
export type AppRouterTypes = inferRouterOutputs<typeof appRouter>;
