# # Step 1 — Install dependencies
# FROM node:20-alpine AS deps
# WORKDIR /app
# COPY package.json package-lock.json* yarn.lock* ./
# RUN npm install --legacy-peer-deps

# # Step 2 — Build Next.js
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY . .
# COPY --from=deps /app/node_modules ./node_modules
# # importing env varibles 
# ARG DATABASE_URL
# ARG MONGODB_URI

# ENV DATABASE_URL=$DATABASE_URL
# ENV MONGODB_URI=$MONGODB_URI

# # IMPORTANT: Generate Prisma Client
# RUN npx prisma generate
# RUN npm run build

# # Step 3 — Run production server
# FROM node:20-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/prisma ./prisma 

# EXPOSE 3000

# # Run Prisma migrations at container start, then start Next.js
# CMD npx prisma db push && npm start



#neww

###############################################
# Step 1 — Install dependencies
###############################################
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps


###############################################
# Step 2 — Build Next.js
###############################################
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build-time environment variables
ARG DATABASE_URL
ARG MONGODB_URI
ENV DATABASE_URL=$DATABASE_URL
ENV MONGODB_URI=$MONGODB_URI

RUN npx prisma generate
RUN npm run build


###############################################
# Step 3 — Production Dependencies Only
###############################################
FROM node:20-alpine AS proddeps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production --legacy-peer-deps


###############################################
# Step 4 — Final Runtime Image
###############################################
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy production node_modules
COPY --from=proddeps /app/node_modules ./node_modules

# Copy only required build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Apply database migrations safely, then start server
CMD npx prisma migrate deploy && npm start
