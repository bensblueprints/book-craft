/* eslint-disable @typescript-eslint/no-unused-vars */
import accountRoute from "@/server/routes/accountRoute";
import authRoute from "@/server/routes/authRoute";
import bookRoute from "@/server/routes/bookRoute";
import creditRoute from "@/server/routes/creditRoute";
import profileRoute from "@/server/routes/profileRoute";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

const routes = app
  .route("/", authRoute)
  .route("/profile", profileRoute)
  .route("/book", bookRoute)
  .route("/credit", creditRoute)
  .route("/account", accountRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export type AppType = typeof routes;
