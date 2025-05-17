import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { OpenAI } from "openai";
import { z } from "zod";
import prisma from "../db/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const app = new Hono()
  .post(
    "/api-key",
    zValidator(
      "json",
      z.object({
        openAIKey: z.string(),
        openRouterKey: z.string(),
        userId: z.string(),
      })
    ),
    async (c) => {
      const { openAIKey, userId } = c.req.valid("json");

      try {
        const openai = new OpenAI({ apiKey: openAIKey });

        // Use GPT-4 model to validate key tier
        await openai.chat.completions.create({
          model: "gpt-4", // Trying GPT-4 directly
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 1,
        });

        // save in db
        await prisma.user.update({
          where: { id: userId },
          data: { openAIKey },
        });

        return c.json({ valid: true });
      } catch (error: any) {
        console.log("error", error.message);
        if (error.status === 401) {
          return c.json({ valid: false, error: "Invalid API key" });
        }

        if (
          error.message?.includes(
            "404 The model `gpt-4` does not exist or you do not have access to it."
          ) ||
          error.message?.includes("model not found")
        ) {
          return c.json({
            valid: false,
            error: "Only GPT-4 enabled (premium) API keys are accepted",
          });
        }

        return c.json({
          valid: false,
          error: "Unknown error validating API key",
        });
      }
    }
  )
  .get("/check-api-configuration/:userId", async (c) => {
    const { userId } = c.req.param();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        openAIKey: true,
        openRouterKey: true,
      },
    });

    return c.json({
      openAIKey: !!user?.openAIKey,
      openRouterKey: !!user?.openRouterKey,
    });
  });

export default app;
