#!/usr/bin/env bash
set -euo pipefail

NAME="$1"

if [ -z "${NAME-}" ]; then
  echo "❌ Please provide a migration name (e.g., add-user-table)"
  exit 1
fi

# Get timestamp (seconds since epoch)
TIMESTAMP="$(date +%s)"
FILENAME="${TIMESTAMP}_${NAME}"

# Resolve script dir and project root (script located at ./scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "$PROJECT_ROOT"

# Change to project root
cd "$PROJECT_ROOT"

# Generate migration (forward args after -- to the npm script)
npx cross-env NODE_ENV=local dotenv -e .env.local npm run typeorm:generate -- "./src/migrations/${FILENAME}"