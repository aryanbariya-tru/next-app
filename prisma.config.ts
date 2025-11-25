import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { PrismaClient } from "@prisma/client";

export default defineConfig({
  schema: "prisma/schema.prisma",
  engine: "classic",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Connection string from environment variable
    url: env("DATABASE_URL"),
  },
});

// Initialize Prisma client WITHOUT adapter/url
export const prisma = new PrismaClient();
