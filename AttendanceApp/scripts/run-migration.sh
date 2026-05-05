
#!/bin/sh
# Usage: ./scripts/migration-run.sh local
# Runs TypeORM migrations using ts-node + tsconfig-paths

set -eu

ENV_NAME="${1:-}"

if [ -z "$ENV_NAME" ]; then
  echo "❌ Please provide an environment (e.g., local, staging, production)" >&2
  exit 1
fi

# # Detect if running in Docker (when /repo exists) or locally
# if [ -d "/repo" ]; then
#   # Docker environment: always work from /repo
#   WORK_DIR="/repo"
#   DS_PATH="./AuthApp/scripts/migration-data-source.ts"
# else
  # Local environment: resolve from script location  
  SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
  WORK_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
  DS_PATH="./scripts/migration-data-source.ts"
# fi

cd "$WORK_DIR"

echo "📁 Working directory: $WORK_DIR"
echo "🔧 Running TypeORM migrations with environment: $ENV_NAME"

# Run TypeORM migration:run with proper module resolution
# The tsconfig-paths/register loader reads path aliases from tsconfig.base.json 

NODE_ENV="$ENV_NAME" \
TS_NODE_PROJECT=./tsconfig.json \
npx typeorm-ts-node-commonjs migration:run -d "$DS_PATH"
