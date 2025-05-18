import { signupSchema } from "@/schemas/authSchema";
import { zValidator } from "@hono/zod-validator";
import { hash } from "bcryptjs";
import { Hono } from "hono";
import prisma from "../db/prisma";

const app = new Hono()
  .post("/signup", zValidator("json", signupSchema), async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return c.json(
          {
            error: {
              email: {
                message: "User with this email already exists",
              },
            },
          },
          404
        );
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          credits: 3, // Default credits for new users
        },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return c.json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      return c.json(
        {
          error: {
            email: {
              message: "Something went wrong",
            },
          },
        },
        500
      );
    }
  })
  .get("/auth-check", async (c) => {
    try {
      return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return c.json(
        {
          error: {
            email: {
              message: "Something went wrong",
            },
          },
        },
        500
      );
    }
  });

export default app;
