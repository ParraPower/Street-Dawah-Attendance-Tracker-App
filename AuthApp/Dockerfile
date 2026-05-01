
# # syntax=docker/dockerfile:1

# # --------------------------
# # 1) deps: install node_modules (cached)
# # --------------------------
# FROM node:20-alpine AS deps
# WORKDIR /usr/src/app

# # If you have native deps like bcrypt, sharp, etc. you may need these.
# # Uncomment if npm ci fails with node-gyp / native build errors.
# # RUN apk add --no-cache python3 make g++

# COPY package*.json ./
# RUN npm ci

# # --------------------------
# # 2) build: compile TS -> dist (if you have a build step)
# # --------------------------
# FROM node:20-alpine AS build
# WORKDIR /usr/src/app

# # copy tsconfig(s) early so tooling can read it
# COPY tsconfig*.json ./

# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY . .

# # Build if present (safe for JS-only projects too)
# RUN npm run build --if-present

# # --------------------------
# # 3) runtime: minimal image used by both app + migrate services
# # --------------------------
# FROM node:20-alpine AS runtime
# WORKDIR /usr/src/app

# # Default to production; compose can override NODE_ENV=local at runtime
# ENV NODE_ENV=production

# # Copy dependencies
# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY package*.json ./

# # Copy compiled output if it exists (typical TS setup)
# # COPY --from=build /usr/src/app/dist ./dist

# # Copy runtime-needed non-compiled assets that apps often need:
# # (These folders exist per your MDX; safe to copy even if not all are required)
# COPY --from=build /usr/src/app/src ./src
# #COPY --from=build /usr/src/app/scripts ./scripts

# # If you rely on a TypeORM datasource file outside dist (some projects do),
# # keeping src/ in the image lets migration commands still find it.

# EXPOSE 4001

# # Compose overrides CMD for app/migrate, so a sane default is fine:
# CMD ["node", "dist/index.js"]


# syntax=docker/dockerfile:1

# Build stage: compile with all files present for proper module resolution
FROM node:20-alpine AS build
WORKDIR /repo

# Copy everything (excluding files in .dockerignore)
COPY . .

# Install dependencies with all source files in place
# This ensures npm workspaces correctly symlink to StreetDawahAppFramework with its dist/ already present
RUN npm ci --workspaces --legacy-peer-deps

# Build StreetDawahAppFramework first (required dependency)
RUN npm run build -w StreetDawahAppFramework --if-present

# Build AuthApp
RUN npm run build -w AuthApp --if-present

# --------------------------
# Runtime: minimal image for app + migrate
# --------------------------
FROM node:20-alpine AS runtime
WORKDIR /repo

ENV NODE_ENV=production

# Copy files from build stage
COPY --from=build /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY AuthApp/package.json AuthApp/package.json
COPY StreetDawahAppFramework/package.json StreetDawahAppFramework/package.json

# Copy compiled outputs
COPY --from=build /repo/AuthApp/dist ./AuthApp/dist  
COPY --from=build /repo/StreetDawahAppFramework/dist ./StreetDawahAppFramework/dist

# Copy src and scripts for ts-node migration execution
COPY --from=build /repo/AuthApp/src ./AuthApp/src
COPY --from=build /repo/AuthApp/scripts ./AuthApp/scripts

EXPOSE 4001

# Default command (compose overrides for dev/migrate)
CMD ["node", "AuthApp/dist/index.js"]

