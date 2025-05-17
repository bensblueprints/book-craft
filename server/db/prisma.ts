/* eslint-disable no-var */
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Extend the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

// Declare a variable to store the Prisma client instance
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
