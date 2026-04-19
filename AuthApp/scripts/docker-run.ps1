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
Write-Host "Spinning up app with: docker compose -f docker-compose.$Env.yml --env-file .env.$Env up --build -d"
docker compose -f docker-compose.$Env.yml --env-file .env.$Env up --build -d