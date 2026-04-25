
#!/bin/sh
# Usage: ./scripts/migration-run.sh local
# Runs TypeORM migrations using ts-node + tsconfig-paths

set -eu

ENV_NAME="${1:-}"

if [ -z "$ENV_NAME" ]; then
  echo "❌ Please provide an environment (e.g., local, staging, production)" >&2
  exit 1
fi

# Resolve project root (assumes this script is in ./scripts/)
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PROJECT_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"

echo "$PROJECT_ROOT"
cd "$PROJECT_ROOT"

echo "Running migration with cmd: NODE_ENV=$ENV_NAME TS_NODE_PROJECT=./tsconfig.json ts-node -r tsconfig-paths/register ../node_modules/.bin/typeorm/cli.js migration:run -d ./scripts/migration-data-source.ts"

# Option A (recommended on Linux): set env var directly (no cross-env needed on POSIX)
NODE_ENV="$ENV_NAME" \
TS_NODE_PROJECT=./tsconfig.json \
npx ts-node -r tsconfig-paths/register ../node_modules/.bin/typeorm/cli.js migration:run -d ./scripts/migration-data-source.ts
