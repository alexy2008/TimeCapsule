Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

if (-not $env:SERVER_PORT) {
    $env:SERVER_PORT = "4179"
}

& .\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=$($env:SERVER_PORT)"
