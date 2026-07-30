import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "../../shared/const";
import * as db from "../db";

export type SafeUser = Omit<User, "password">;

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: SafeUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: SafeUser | null = null;

  try {
    const token = opts.req.cookies[COOKIE_NAME];
    if (token) {
      const session = await db.getSessionByToken(token);
      if (session) {
        user = (await db.getUserById(session.userId)) || null;
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
