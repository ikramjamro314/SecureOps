import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const isDbConfigured = Boolean(
  process.env.DATABASE_URL &&
    (process.env.DATABASE_URL.startsWith("mongodb://") ||
      process.env.DATABASE_URL.startsWith("mongodb+srv://"))
);

export const prisma: PrismaClient = isDbConfigured
  ? globalForPrisma.prisma || new PrismaClient()
  : (new Proxy({}, {
      get() {
        return () => Promise.reject(new Error("No DATABASE_URL configured"));
      },
    }) as unknown as PrismaClient);

if (isDbConfigured && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}