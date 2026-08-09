param (
    [string]$Env
)

if (-not $Env) {
    Write-Host "❌ Please provide an environment (e.g., local, staging, production)"
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path "$scriptDir\.."

Set-Location $projectRoot

Write-Host "Running migrations with environment: $Env"
npx cross-env NODE_ENV=$Env TS_NODE_PROJECT=./tsconfig.json typeorm-ts-node-commonjs migration:run -d ./scripts/migration-data-source.ts
