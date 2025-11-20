# Step 1 — Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --legacy-peer-deps

# Step 2 — Build Next.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# IMPORTANT: Generate Prisma Client
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate
RUN npm run build

# Step 3 — Run production server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma 

EXPOSE 3000

# Run Prisma migrations at container start, then start Next.js
CMD npx prisma db push && npm start
