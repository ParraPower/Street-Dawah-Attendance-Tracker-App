# Usage: .\generate-migration.ps1 add-user-table

param (
    [string]$Name
)

if (-not $Name) {
    Write-Host "❌ Please provide a migration name (e.g., add-user-table)"
    exit 1
}

# Get timestamp
$timestamp = [int][double]::Parse((Get-Date -UFormat %s))
$filename = "$timestamp_$Name"

# Resolve project root (assumes script is in ./scripts/)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path "$scriptDir\.."

Write-Host $projectRoot

# Change to project root
Set-Location $projectRoot

# Generate migration
Write-Host "Generating migration with cmd: cross-env NODE_ENV=local TS_NODE_PROJECT=./tsconfig.json ts-node -r tsconfig-paths/register ../node_modules/typeorm/cli.js migration:generate -d ./scripts/migration-data-source.ts for environment: local and filename: $filename"
npx cross-env NODE_ENV=local TS_NODE_PROJECT=./tsconfig.json ts-node -r tsconfig-paths/register ../node_modules/typeorm/cli.js migration:generate "./src/migrations/$filename" -d ./scripts/migration-data-source.ts