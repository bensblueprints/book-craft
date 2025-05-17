import { Hono } from "hono";
import prisma from "../db/prisma";

const app = new Hono().get("/:id", async (c) => {
  const userId = c.req.param("id");

  const purchaseHistories = await prisma.purchaseHistory.findMany({
    where: {
      userId: userId || "",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return c.json(purchaseHistories);
});

export default app;
