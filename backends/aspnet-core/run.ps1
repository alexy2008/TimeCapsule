Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

if (-not $env:PORT) {
    $env:PORT = "18050"
}

dotnet run --project .\aspnet-core.csproj --no-launch-profile
