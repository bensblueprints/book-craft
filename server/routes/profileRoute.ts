import { Hono } from "hono";
import prisma from "../db/prisma";

const app = new Hono().get("/:id", async (c) => {
  const userId = c.req.param("id");

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return c.json(user);
});

export default app;
