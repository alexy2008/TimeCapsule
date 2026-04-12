Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

if (-not $env:SERVER_PORT) {
    $env:SERVER_PORT = "18000"
}

mvn spring-boot:run
