// server/hono.ts (or any path you prefer)
import { Hono } from "hono";
import accountRoute from "./routes/accountRoute";
import authRoute from "./routes/authRoute";
import bookRoute from "./routes/bookRoute";
import creditRoute from "./routes/creditRoute";
import profileRoute from "./routes/profileRoute";

export const app = new Hono().basePath("/api");

app
  .route("/", authRoute)
  .route("/profile", profileRoute)
  .route("/book", bookRoute)
  .route("/credit", creditRoute)
  .route("/account", accountRoute);

export type AppType = typeof app;
