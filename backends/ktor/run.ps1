Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

if (-not $env:PORT) {
    $env:PORT = "18090"
}

& .\gradlew.bat run --quiet
