# # Usage: .\generate-migration.ps1 add-user-table

# param (
#     [string]$Env
# )

# if (-not $Env) {
#     Write-Host "❌ Please provide an environment (e.g., local, staging, production)"
#     exit 1
# }

# # Get timestamp
# $timestamp = [int][double]::Parse((Get-Date -UFormat %s))

# # Resolve project root (assumes script is in ./scripts/)
# $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
# $projectRoot = Resolve-Path "$scriptDir\.."

# Write-Host $projectRoot

# # Change to project root
# Set-Location $projectRoot

# # Generate migration
# Write-Host "Running migration with cmd: cross-env NODE_ENV=$Env ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js  migration:run -d ./scripts/migration-data-source.ts for environment: $Env"
# npx cross-env NODE_ENV=$Env ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./scripts/migration-data-source.ts


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
