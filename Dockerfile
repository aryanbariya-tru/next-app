# ---------- Stage 1: Install dependencies ----------
FROM node:20-slim AS deps
WORKDIR /app

# Install only what's needed
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev


# ---------- Stage 2: Build the app ----------
FROM node:20-slim AS builder
WORKDIR /app

# copy entire app
COPY . .

# copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Add env variables (only needed during build for prisma)
ARG DATABASE_URL
ARG MONGODB_URI

ENV DATABASE_URL=$DATABASE_URL
ENV MONGODB_URI=$MONGODB_URI

# Generate lightweight Prisma Client
RUN npx prisma generate

# Build next.js
RUN npm run build


# ---------- Stage 3: Production-only image (NO DEV deps, NO extra files) ----------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy required folders for Next.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

# Run DB push + start app
CMD ["sh", "-c", "npx prisma db push && npm start"]
