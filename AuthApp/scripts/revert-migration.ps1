# Usage: .\generate-migration.ps1 add-user-table

param (
    [string]$Env
)

if (-not $Env) {
    Write-Host "❌ Please provide an environment (e.g., local, staging, production)"
    exit 1
}

# Get timestamp
$timestamp = [int][double]::Parse((Get-Date -UFormat %s))

# Resolve project root (assumes script is in ./scripts/)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path "$scriptDir\.."

Write-Host $projectRoot

# Change to project root
Set-Location $projectRoot

# Reverting migration
Write-Host "Reverting migration with cmd: cross-env NODE_ENV=$Env TS_NODE_PROJECT=./tsconfig.json ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./scripts/migration-data-source.ts for environment: $Env"
npx cross-env NODE_ENV=$Env TS_NODE_PROJECT=./tsconfig.json ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./scripts/migration-data-source.ts