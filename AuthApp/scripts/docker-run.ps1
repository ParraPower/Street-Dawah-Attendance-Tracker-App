
param (
    [string]$App,
    [string]$Env
)

if (-not $App) {
    Write-Host "❌ Please provide an app (e.g., authapp, attendance)"
    exit 1
}

if (-not $Env) {
    Write-Host "❌ Please provide an environment (e.g., local, staging, production)"
    exit 1
}

# Resolve project root (script lives in AuthApp/scripts)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path "$scriptDir\..\.."

Set-Location $projectRoot

$composeFile = "docker/$App.$Env.yml"
$envFile = "./AuthApp/.env.$Env"

Write-Host "Spinning up $App ($Env) with:"
Write-Host "docker compose -f $composeFile --env-file $envFile up --build -d"

docker compose `
  -f $composeFile `
  --env-file $envFile `
  up --build -d
