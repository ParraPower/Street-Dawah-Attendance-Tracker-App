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

# Build AttendanceApp
RUN npm run build -w AttendanceApp --if-present

# --------------------------
# Runtime: minimal image for app + migrate
# --------------------------
FROM node:20-alpine AS runtime
WORKDIR /repo

ENV NODE_ENV=production

# Copy files from build stage
COPY --from=build /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY AttendanceApp/package.json AttendanceApp/package.json
COPY StreetDawahAppFramework/package.json StreetDawahAppFramework/package.json

# Copy compiled outputs
COPY --from=build /repo/AttendanceApp/dist ./AttendanceApp/dist  
COPY --from=build /repo/StreetDawahAppFramework/dist ./StreetDawahAppFramework/dist

# Copy src and scripts for ts-node migration execution
COPY --from=build /repo/AuthAttendanceAppApp/src ./AttendanceApp/src
COPY --from=build /repo/AttendanceApp/scripts ./AttendanceApp/scripts

EXPOSE 4002

# Default command (compose overrides for dev/migrate)
CMD ["node", "AttendanceApp/dist/index.js"]

