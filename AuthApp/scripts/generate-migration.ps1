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
npx cross-env NODE_ENV=local dotenv -e .env.local npm run typeorm:generate -- "./src/migrations/$filename"
